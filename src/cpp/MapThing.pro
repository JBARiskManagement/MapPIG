#-------------------------------------------------
#
# Project created by QtCreator 2015-07-22T13:12:01
#
#-------------------------------------------------

QT       += core gui
QT       += webkitwidgets
QT       += svg
QT       += sql

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = MapThing
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    bridge.cpp \


HEADERS  += mainwindow.h \
    constants.h \
    bridge.h \

RESOURCES += \
    resources.qrc

INCLUDEPATH += libmapthing/
LIBS += -L../build-libmapthing/debug -lmapthing

DISTFILES += \
    ../resources/vendors/bootstrap/js/bootstrap.js \
    ../resources/vendors/bootstrap/js/bootstrap.min.js \
    ../resources/vendors/bootstrap/js/npm.js \
    ../resources/vendors/js/bootbox.min.js \
    ../resources/vendors/js/Chart.min.js \
    ../resources/vendors/js/jquery-1.11.3.min.js \
    ../resources/vendors/js/jquery-sidebar.js \
    ../resources/vendors/js/leaflet-search.src.js \
    ../resources/vendors/js/leaflet-sidebar.js \
    ../resources/vendors/L.Geosearch/js/l.control.geosearch.js \
    ../resources/vendors/L.Geosearch/js/l.geosearch.provider.bing.js \
    ../resources/vendors/L.Geosearch/js/l.geosearch.provider.esri.js \
    ../resources/vendors/L.Geosearch/js/l.geosearch.provider.google.js \
    ../resources/vendors/L.Geosearch/js/l.geosearch.provider.nokia.js \
    ../resources/vendors/L.Geosearch/js/l.geosearch.provider.openstreetmap.js \
    ../resources/vendors/L.Loading/Control.Loading.js \
    ../resources/vendors/Leaflet/leaflet-src.js \
    ../resources/vendors/Leaflet/leaflet.js \
    ../resources/vendors/MarkerCluster/leaflet.markercluster-src.js \
    ../resources/vendors/MarkerCluster/leaflet.markercluster.js \
    ../resources/vendors/PruneCluster/PruneCluster.js \
    ../resources/vendors/PruneCluster/PruneCluster.min.js \
    ../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.eot \
    ../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.ttf \
    ../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.woff \
    ../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.woff2 \
    ../resources/vendors/Leaflet/images/layers-2x.png \
    ../resources/vendors/Leaflet/images/layers.png \
    ../resources/vendors/Leaflet/images/marker-icon-2x.png \
    ../resources/vendors/Leaflet/images/marker-icon.png \
    ../resources/vendors/Leaflet/images/marker-shadow.png \
    ../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.svg \
    ../resources/vendors/bootstrap/css/bootstrap-theme.css \
    ../resources/vendors/bootstrap/css/bootstrap-theme.min.css \
    ../resources/vendors/bootstrap/css/bootstrap.css \
    ../resources/vendors/bootstrap/css/bootstrap.min.css \
    ../resources/vendors/css/leaflet-sidebar.css \
    ../resources/vendors/L.Geosearch/css/l.geosearch.css \
    ../resources/vendors/L.Loading/Control.Loading.css \
    ../resources/vendors/Leaflet/leaflet.css \
    ../resources/vendors/MarkerCluster/MarkerCluster.css \
    ../resources/vendors/MarkerCluster/MarkerCluster.Default.css \
    ../resources/vendors/PruneCluster/LeafletStyleSheet.css \
    ../resources/vendors/bootstrap/css/bootstrap-theme.css.map \
    ../resources/vendors/bootstrap/css/bootstrap.css.map \
    ../resources/vendors/PruneCluster/PruneCluster.js.map \
    ../resources/stylesheet.qss \
    ../resources/mapthing/dist/mapthing.min.js \
    ../resources/mapthing/dist/mapthing.min.css \
    ../resources/mapthing/img/loader.gif \
    ../resources/mapthing/img/blank.png \
    ../resources/mapthing/img/ffa500-marker-32.png \
    ../resources/mapthing/img/layers.png \
    ../resources/mapthing/img/search-icon.png \
    ../resources/mapthing/img/TransLogo.png \
    ../resources/index.html \


Release:DESTDIR = release
Release:OBJECTS_DIR = release/.obj
Release:MOC_DIR = release/.moc
Release:RCC_DIR = release/.rcc
Release:UI_DIR = release/.ui

Debug:DESTDIR = debug
Debug:OBJECTS_DIR = debug/.obj
Debug:MOC_DIR = debug/.moc
Debug:RCC_DIR = debug/.rcc
Debug:UI_DIR = debug/.ui


