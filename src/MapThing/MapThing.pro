#-------------------------------------------------
#
# Project created by QtCreator 2015-07-22T13:12:01
#
#-------------------------------------------------

QT       += core gui
QT       += webkitwidgets
QT       += sql

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = MapThing
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    datarequests.cpp \
    jcalfdb.cpp

HEADERS  += mainwindow.h \
    datarequests.h \
    constants.h \
    jcalfdb.h

RESOURCES += \
    resources.qrc

DISTFILES += \
    ../Resources/js/map.js
