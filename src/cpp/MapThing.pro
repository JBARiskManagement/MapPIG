#-------------------------------------------------
#
# Project created by QtCreator 2015-07-22T13:12:01
#
#-------------------------------------------------

QT       += core gui
QT       += webkitwidgets
QT       += sql
QT       += svg

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
    portfolio.h \
    plugininterface.h

RESOURCES += \
    resources.qrc

INCLUDEPATH += C:/GIT/csv_parser/src/

system(uglifyjs ../resources/mapthing/js/map.js ../resources/mapthing/js/jcalflayer.js  ../resources/mapthing/js/layerpanel.js --screw-ie8 --compress --output ../resources/mapthing/js/mapthing.min.js)

DISTFILES += \
    ../resources/mapthing/js/jcalflayer.js \
    ../resources/mapthing/js/map.js \
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
    ../resources/mapthing/img/loader.gif \
    ../resources/mapthing/img/blank.png \
    ../resources/mapthing/img/ffa500-marker-32.png \
    ../resources/mapthing/img/layers.png \
    ../resources/mapthing/img/search-icon.png \
    ../resources/mapthing/img/TransLogo.png \
    ../resources/vendors/Leaflet/images/layers-2x.png \
    ../resources/vendors/Leaflet/images/layers.png \
    ../resources/vendors/Leaflet/images/marker-icon-2x.png \
    ../resources/vendors/Leaflet/images/marker-icon.png \
    ../resources/vendors/Leaflet/images/marker-shadow.png \
    ../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.svg \
    ../resources/mapthing/css/leaflet-search.src.css \
    ../resources/mapthing/css/main.css \
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
    ../resources/index.html \
    ../resources/vendors/bootstrap/css/bootstrap-theme.css.map \
    ../resources/vendors/bootstrap/css/bootstrap.css.map \
    ../resources/vendors/PruneCluster/PruneCluster.js.map \
    ../resources/stylesheet.qss \
    ../resources/mapthing/js/layerpanel.js \
    ../resources/mapthing/js/dom.js \
    ../resources/mapthing/js/bubbelayer.js


