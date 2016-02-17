#-------------------------------------------------
#
# Project created by QtCreator 2015-12-21T14:32:52
#
#-------------------------------------------------


QT       += core gui
QT       += sql

TARGET = mapthing
TEMPLATE = lib
CONFIG += staticlib

SOURCES += \
    portfolio.cpp \
    progresscounter.cpp \
    C:/GIT/csv_parser/src/csvparser.c \
    mapthingutil.cpp \
    workerbase.cpp

HEADERS += \
    portfolio.h \
    progresscounter.h \
    C:/GIT/csv_parser/src/csvparser.h \
    mapthingutil.h \
    plugininterface.h \
    workerbase.h

INCLUDEPATH += C:/GIT/csv_parser/src/

unix {
    target.path = /usr/lib
    INSTALLS += target
}

DEFINES += _CRT_SECURE_NO_WARNINGS
