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
    jcalfdb.cpp \
    bridge.cpp \
    C:/GIT/csv_parser/src/csvparser.c \
    progresscounter.cpp


HEADERS  += mainwindow.h \
    datarequests.h \
    constants.h \
    jcalfdb.h \
    bridge.h \
    C:/GIT/csv_parser/src/csvparser.h \
    progresscounter.h

RESOURCES += \
    resources.qrc

DISTFILES += \
    ../Resources/js/map.js

INCLUDEPATH += C:/GIT/csv_parser/src/


