#-------------------------------------------------
#
# Project created by QtCreator 2015-12-21T14:32:52
#
#-------------------------------------------------

QT       += core
QT       += sql

TARGET = mapthing
TEMPLATE = lib
CONFIG += staticlib

SOURCES += \
    portfolio.cpp \
    progresscounter.cpp \
    C:/GIT/csv_parser/src/csvparser.c \
    mapthingutil.cpp

HEADERS += \
    portfolio.h \
    progresscounter.h \
    C:/GIT/csv_parser/src/csvparser.h \
    mapthingutil.h \
    fatof.h

INCLUDEPATH += C:/GIT/csv_parser/src/

unix {
    target.path = /usr/lib
    INSTALLS += target
}
