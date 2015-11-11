#include "mainwindow.h"
#include "constants.h"


// Qt Classes
#include <QDesktopWidget>
#include <QRect>
#include <QFile>
#include <QCoreApplication>
#include <QWebSettings>
#include <QShortcut>


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

    QWebPage *page = webview->page();
    page->settings()->setAttribute(QWebSettings::PluginsEnabled, true);
    page->settings()->setAttribute(QWebSettings::JavascriptEnabled, true);
    page->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    webview->setContentsMargins(0,0,0,0);

    // The bridge forms the link between C++ and javascript.
    // bridge methods can be called from both sides (use signals/slots) and pass data
    dataRequest = new DataRequests();


    bridge = new Bridge(this);
    page->mainFrame()->addToJavaScriptWindowObject("BRIDGE", bridge);


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
    inspector->setPage(page);

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
    webview->setUrl(mapUrl);
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
