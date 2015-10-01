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

    toolBar = addToolBar("main toolbar");
    dataA = toolBar->addAction("Map");
    dataA = toolBar->addAction("Data");

    webview = new QWebView();

    webview->page()->settings()->setAttribute(QWebSettings::PluginsEnabled, true);
    webview->page()->settings()->setAttribute(QWebSettings::JavascriptEnabled, true);
    //webview->page()->setLinkDelegationPolicy(QWebPage::DelegateAllLinks);
    webview->page()->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    webview->setContentsMargins(0,0,0,0);
    //webview->setRenderHints(QPainter::HighQualityAntialiasing |QPainter::SmoothPixmapTransform);

    inspector = new QWebInspector();
    inspector->resize(900,500);
    inspector->setPage(webview->page());

    QShortcut *inspectorShortcut = new QShortcut(QKeySequence("Ctrl+D"), this);
    connect(inspectorShortcut, SIGNAL(activated()), this, SLOT(toggleInspector()));

    // Setup the size of the window
    setSize();

    // Load the stylesheet
    //loadStyleSheet();
    //setWindowIcon(QIcon(":/TransLogo.png"));

    setCentralWidget(webview);

    // Load the index page
    showMap();
}

MainWindow::~MainWindow()
{
    delete(webview);
    delete(inspector);
    delete(toolBar);
}

void MainWindow::setSize()
{
  QDesktopWidget desktop;
  QRect screenSize = desktop.availableGeometry(desktop.primaryScreen());

  int width = screenSize.width()*0.63;
  int height = screenSize.height()*0.7;
  //int webViewWidth = width*0.85;

  //QList<int> list;
  //list << width - webViewWidth << webViewWidth;
  resize(width, height);
  //mainWidget->setSizes(list);
}

void MainWindow::loadStyleSheet()
{
  QFile *ssheet = new QFile(":/stylesheet.qss");
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
    //inspector->show();
}


void MainWindow::quit()
{
    qApp->quit();
}
