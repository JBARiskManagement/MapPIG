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

    QWebPage *page = webview->page();
    page->settings()->setAttribute(QWebSettings::PluginsEnabled, true);
    page->settings()->setAttribute(QWebSettings::JavascriptEnabled, true);
    page->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);
    webview->setContentsMargins(0,0,0,0);

    // The bridge forms the link between C++ and javascript.
    // bridge methods can be called from both sides (use signals/slots) and pass data
    bridge = new DataRequests(this);
    page->mainFrame()->addToJavaScriptWindowObject("BRIDGE", bridge);

    // Web inspector only really required for debugging so should not
    // be documented in user documentation.
    // Do not pass this as parent so it will be created as a separate dialog.
    // This means we need to explicitly delete.
    inspector = new QWebInspector;
    //inspector->resize(950,700);
    inspector->setPage(page);

    // Setup the size of the window
    setSize();

    //loadStyleSheet();
    setWindowIcon(QIcon(":/../Resources/img/TransLogo.png"));

    setCentralWidget(webview);

    // set up the HTML UI
    showMap();
}

MainWindow::~MainWindow()
{
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
}

void MainWindow::quit()
{
    qApp->quit();
}
