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
    bridge.cpp \
    C:/GIT/csv_parser/src/csvparser.c \
    progresscounter.cpp \
    portfolio.cpp


HEADERS  += mainwindow.h \
    datarequests.h \
    constants.h \
    bridge.h \
    C:/GIT/csv_parser/src/csvparser.h \
    progresscounter.h \
    fatof.h \
    portfolio.h

RESOURCES += \
    resources.qrc

INCLUDEPATH += C:/GIT/csv_parser/src/


