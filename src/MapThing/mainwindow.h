#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "datarequests.h"

#include <QMainWindow>
#include <QWebView>
#include <QWebFrame>
#include <QWebInspector>
#include <QToolBar>
#include <QThread>

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void toggleInspector();


private:
    QWebView *webview;
    QWebFrame *mainFrame;
    QWebInspector *inspector;
    QToolBar *toolBar;
    QAction *dataA;
    QAction *mapA;
    DataRequests *bridge;
    QThread *workerThread;

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
};

#endif // MAINWINDOW_H
