#include "mainwindow.h"
#include "constants.h"
#include "plugininterface.h"


// Qt Classes
#include <QDesktopWidget>
#include <QRect>
#include <QFile>
#include <QCoreApplication>
#include <QWebSettings>
#include <QWebFrame>
#include <QShortcut>
#include <QPluginLoader>
//#include <QtPrintSupport/QPrinter>
#include <QPixMap>
#include <QImage>
#include <QtSvg/QSvgRenderer>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
    // No need to explicitly call delete as under control of QObject. This applies to
    // all objects that inherit from QObject and we pass a "parent" to (i.e. this)
    webview = new QWebView(this);

    sb = this->statusBar();
    progressBar = new QProgressBar(this);
    progressBar->setFixedHeight(15);
    progressBar->setMinimumHeight(10);
    sb->setSizeGripEnabled(false);
    sb->addPermanentWidget(progressBar, 1);
    progressBar->hide();

    webpage = webview->page();
    webpage->settings()->setAttribute(QWebSettings::PluginsEnabled, true);
    webpage->settings()->setAttribute(QWebSettings::JavascriptEnabled, true);
    webpage->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    webpage->settings()->setAttribute(QWebSettings::SpatialNavigationEnabled, true);
    webpage->settings()->setAttribute(QWebSettings::LocalContentCanAccessRemoteUrls, true);
    webpage->settings()->setAttribute(QWebSettings::LocalContentCanAccessFileUrls, true);
    webview->setContentsMargins(0,0,0,0);

    dataRequest = new DataRequests();

    // The bridge forms the link between C++ and javascript.
    // bridge methods can be called from both sides (use signals/slots) and pass data
    bridge = new Bridge(this);



    // Thread for the bridge
    workerThread = new QThread(this);
    dataRequest->moveToThread(workerThread);
    workerThread->start();

    // Web inspector only really required for debugging so should not
    // be documented in user documentation.
    // Do not pass this as parent so it will be created as a separate dialog.
    // This means we need to explicitly delete.
    inspector = new QWebInspector;
    //inspector->resize(950,700);
    inspector->setPage(webpage);

    // Setup the size of the window
    setSize();

    loadStyleSheet();
    setWindowIcon(QIcon(":/icon"));

    setCentralWidget(webview);

    connect(webpage->mainFrame(), SIGNAL(javaScriptWindowObjectCleared()), this, SLOT(addJsObject()));
    connect(webpage, &QWebPage::loadFinished, this, &MainWindow::loadPlugins);
    connect(bridge, &Bridge::refreshExposures, dataRequest, &DataRequests::refreshExposures);
    //connect(bridge, &Bridge::refreshExposures, this, &MainWindow::showProgressBar);
    connect(bridge, &Bridge::connectDatabase, dataRequest, &DataRequests::setJcalfDatabase);
    connect(bridge, &Bridge::fileLoad, dataRequest, &DataRequests::loadCsv);
    connect(bridge, &Bridge::printRequest, this, &MainWindow::frameToImage);

    //connect(dataRequest, &DataRequests::progressUpdated, bridge, &Bridge::progressUpdated);
    connect(dataRequest, &DataRequests::progressUpdated, this, &MainWindow::showProgress);
    connect(dataRequest, &DataRequests::riskUpdated, bridge, &Bridge::exposureUpdated);
    connect(dataRequest, &DataRequests::databaseConnected, bridge, &Bridge::databaseConnected);
    connect(dataRequest, &DataRequests::error, bridge, &Bridge::error);
    connect(dataRequest, &DataRequests::workStarted, this, &MainWindow::showProgressBar);
    connect(dataRequest, &DataRequests::workFinished, bridge, &Bridge::workFinished);
    connect(dataRequest, &DataRequests::workFinished, this, &MainWindow::resetStatusBar);

    connect(dataRequest, &DataRequests::markerLoadingStats, bridge, &Bridge::markerLoadingStats);

    // set up the HTML UI
    showMap();

    // Load the plugins - !Must come after showMap() as it requires JS to be available!
    //loadPlugins();
}

MainWindow::~MainWindow()
{
    workerThread->deleteLater();
}

void MainWindow::addJsObject()
{
    webpage->mainFrame()->addToJavaScriptWindowObject(QString("BRIDGE"), bridge);
}

void MainWindow::setSize()
{
  QDesktopWidget desktop;
  QRect screenSize = desktop.availableGeometry(desktop.primaryScreen());

  int width = screenSize.width()*0.75;
  int height = screenSize.height()*0.8;
  resize(width, height);
}

void MainWindow::loadStyleSheet()
{
  QFile *ssheet = new QFile(":/stylesheet");
  if (!ssheet->open(QIODevice::ReadOnly | QIODevice::Text))
    printf("Could not open\n");

  QTextStream in(ssheet);
  QString styleSheet = in.readAll();
  delete(ssheet);

  setStyleSheet(styleSheet);

}

void MainWindow::showMap()
{
    QDir resourcesDir = QDir(qApp->applicationDirPath());
#if defined(Q_OS_WIN)
    if (resourcesDir.dirName().toLower() == "debug" || resourcesDir.dirName().toLower() == "release")
        resourcesDir.cdUp();
#endif
    resourcesDir.cdUp();
    resourcesDir.cd(resourcesFolder);
    webview->setUrl(QUrl::fromLocalFile(resourcesDir.absoluteFilePath(htmlIndex)));
}

void MainWindow::toggleInspector()
{
    inspector->setVisible(inspector->isHidden());
}

void MainWindow::quit()
{
    qApp->quit();
}

void MainWindow::showProgress(int percent)
{
    progressBar->setValue(percent);
}

void MainWindow::showProgressBar()
{
    progressBar->show();
}

void MainWindow::resetStatusBar(){
    progressBar->setValue(0);
    progressBar->hide();
}

void MainWindow::loadPlugins()
{
    pluginsDir = QDir(qApp->applicationDirPath());
#if defined(Q_OS_WIN)
    if (pluginsDir.dirName().toLower() == "debug" || pluginsDir.dirName().toLower() == "release")
        pluginsDir.cdUp();
#elif defined(Q_OS_MAC)
    if (pluginsDir.dirName() == "MacOS")
    {
        pluginsDir.cdUp();
        pluginsDir.cdUp();
        pluginsDir.cdUp();
    }
#endif
    pluginsDir.cdUp();
    pluginsDir.cd("plugins");

    foreach (QString fileName, pluginsDir.entryList(QDir::Files)) {
        QPluginLoader loader(pluginsDir.absoluteFilePath(fileName));
        QObject *plugin = loader.instance();
        if (plugin)
        {
            addPlugin(plugin);
            pluginFileNames += fileName;
        }
    }
}

void MainWindow::addPlugin(QObject *plugin)
{
    PluginInterface *iPlugin = qobject_cast<PluginInterface *>(plugin);
    if (iPlugin)
    {
        // Get the bridge object for the plugin and add it to the page
        webpage->mainFrame()->addToJavaScriptWindowObject(iPlugin->getBridgeObjectName(), iPlugin->getBridgeObject());

        // Get the worker object and move it to the worker thread
        QObject *worker = iPlugin->getWorkerObject();
        worker->moveToThread(workerThread);

        // Get the javascript for the plugin UI and add it to the page
        QString pluginJs = iPlugin->initialiseUi();
        webpage->mainFrame()->evaluateJavaScript(pluginJs);

        // Create a button for the plugin
        QString js = QString("MT.Dom.addPluginLauncher('%1', '%2', '%3');").arg(iPlugin->getName(),
                                                                          iPlugin->getUiSetupFunction(),
                                                                          iPlugin->getDescription());
        webpage->mainFrame()->evaluateJavaScript(js);
    }
}

void MainWindow::frameToImage(QString filepath)
{
    QWebFrame *frame = webpage->mainFrame();
    frame->evaluateJavaScript(QString("MT.Dom.prepareMapForPrint();"));

    QImage image(webview->size(), QImage::Format_ARGB32_Premultiplied);
    image.fill(Qt::transparent);
    QPainter painter(&image);
    webview->render(&painter, QPoint(), QRegion(), QWidget::DrawChildren);

    painter.setCompositionMode(QPainter::CompositionMode_SourceOver);
    QSvgRenderer rend(QString(":/logo_svg"));
    QRectF rect(10.0, 10.0, 64.0, 64.0); // 1.0795 is the width/height ratio of the standard jba logo
    rend.render(&painter, rect);

    frame->evaluateJavaScript(QString("MT.Dom.resetMapAfterPrint();"));
    image.save(filepath, 0, 100);

    frame->evaluateJavaScript(QString("MT.showMessage('Image saved to %1', 'Print info')").arg(filepath));
}


