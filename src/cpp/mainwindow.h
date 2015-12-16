#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "datarequests.h"
#include "bridge.h"

#include <QMainWindow>
#include <QWebView>
#include <QWebFrame>
#include <QWebInspector>
#include <QToolBar>
#include <QThread>
#include <QStatusBar>
#include <QProgressBar>

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void toggleInspector();
    void showProgress(int percent);
    void resetStatusBar();
    void showProgressBar();


private:
    QWebView *webview;
    QWebPage *webpage;
    QWebFrame *mainFrame;
    QWebInspector *inspector;
    QToolBar *toolBar;
    QAction *dataA;
    QAction *mapA;
    DataRequests *dataRequest;
    Bridge *bridge;
    QThread *workerThread;
    QStatusBar *sb;
    QProgressBar *progressBar;
    QDir pluginsDir;
    QStringList pluginFileNames;

    /**
     * @brief MainWindow::setSize Resizes the application to a nice proportion of the screen
     * and sets the sizes of the two widgets in the splitter window.
     */
    void setSize();

    /*
     * Reads the stylesheet and sets it on the mainwindow
     */
    void loadStyleSheet();

    /**
     * @brief showMap
     *        Loads the map HTML page
     */
    void showMap();
    void quit();
    void addDataRequestsObject();

    /**
     * @brief loadPlugins
     *        Discover and load mapthing plugins from the plugin directory
     */
    void loadPlugins();

    void addPlugin(QObject *plugin);
};

#endif // MAINWINDOW_H
