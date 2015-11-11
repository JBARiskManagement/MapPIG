#include "bridge.h"

#include <QDebug>
#include <QFileDialog>

Bridge::Bridge(QObject *parent) : QObject(parent)
{
}

Bridge::~Bridge()
{

}

void Bridge::showOpenFileDialog(){
    lastFile = QFileDialog::getOpenFileName(0, tr("Open File"), lastDir.absolutePath());
    lastDir = QFileInfo(lastFile).absoluteDir();
    msgSpan.setPlainText(lastFile);
}

void Bridge::connectToPathField(const QWebElement &msg)
{
    msgSpan = msg;
}


void Bridge::loadFile(){
    emit fileLoad(lastFile);
}
