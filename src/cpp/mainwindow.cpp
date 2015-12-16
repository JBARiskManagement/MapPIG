#include "mainwindow.h"
#include "constants.h"
#include "plugininterface.h"


// Qt Classes
#include <QDesktopWidget>
#include <QRect>
#include <QFile>
#include <QCoreApplication>
#include <QWebSettings>
#include <QShortcut>
#include <QPluginLoader>



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
    webview->setContentsMargins(0,0,0,0);

    // The bridge forms the link between C++ and javascript.
    // bridge methods can be called from both sides (use signals/slots) and pass data
    dataRequest = new DataRequests();


    bridge = new Bridge(this);
    webpage->mainFrame()->addToJavaScriptWindowObject("BRIDGE", bridge);


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

    connect(bridge, &Bridge::refreshExposures, dataRequest, &DataRequests::refreshExposures);
    //connect(bridge, &Bridge::refreshExposures, this, &MainWindow::showProgressBar);
    connect(bridge, &Bridge::connectDatabase, dataRequest, &DataRequests::setJcalfDatabase);
    connect(bridge, &Bridge::fileLoad, dataRequest, &DataRequests::loadCsv);

    //connect(dataRequest, &DataRequests::progressUpdated, bridge, &Bridge::progressUpdated);
    connect(dataRequest, &DataRequests::progressUpdated, this, &MainWindow::showProgress);
    connect(dataRequest, &DataRequests::riskUpdated, bridge, &Bridge::exposureUpdated);
    connect(dataRequest, &DataRequests::databaseConnected, bridge, &Bridge::databaseConnected);
    connect(dataRequest, &DataRequests::error, bridge, &Bridge::error);
    connect(dataRequest, &DataRequests::workStarted, this, &MainWindow::showProgressBar);
    connect(dataRequest, &DataRequests::workFinished, bridge, &Bridge::workFinished);
    connect(dataRequest, &DataRequests::workFinished, this, &MainWindow::resetStatusBar);

    connect(dataRequest, &DataRequests::markerLoadingStats, bridge, &Bridge::markerLoadingStats);

    // Load the plugins
    loadPlugins();

    // set up the HTML UI
    showMap();
}

MainWindow::~MainWindow()
{
    workerThread->deleteLater();
}

void MainWindow::setSize()
{
  QDesktopWidget desktop;
  QRect screenSize = desktop.availableGeometry(desktop.primaryScreen());

  int width = screenSize.width()*0.7;
  int height = screenSize.height()*0.75;
  //int webViewWidth = width*0.85;

  //QList<int> list;
  //list << width - webViewWidth << webViewWidth;
  resize(width, height);
  //mainWidget->setSizes(list);
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

void MainWindow::showProgress(int percent){

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
        // Get the javascript for the plugin UI and add it to the page
        webpage->mainFrame()->evaluateJavaScript(iPlugin->initialiseUi(this->progressBar));

        // Create a button for the plugin
        webpage->mainFrame()->evaluateJavaScript(QString("MT.addPluginLauncher(\"%1\", \"%2\")").arg(iPlugin->getName(), iPlugin->getUiSetupFunction()));

        // Get the bridge object for the plugin and add it to the page
        webpage->mainFrame()->addToJavaScriptWindowObject(iPlugin->getBridgeObjectName(), iPlugin->getBridgeObject());

        // Get the worker object and move it to the worker thread
        QObject *worker = iPlugin->getWorkerObject();
        worker->moveToThread(workerThread);


    }
}


