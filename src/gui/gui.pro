#-------------------------------------------------
#
# Project created by QtCreator 2015-07-22T13:12:01
#
#-------------------------------------------------

CONFIG(debug, debug|release) {
DESTDIR = ../../../bin

}
CONFIG(release, debug|release) {
DESTDIR = ../../../bin

}


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

INCLUDEPATH += ../libmapthing/
Release:LIBS += -L../../../bin -lmapthing
Debug:LIBS += -L../../../bin -lmapthing

DISTFILES += \
    ../../resources/mapthing/js/bubblelayer.js \
    ../../resources/mapthing/js/datalayer.js \
    ../../resources/mapthing/js/dom.js \
    ../../resources/mapthing/js/layerpanel.js \
    ../../resources/mapthing/js/leaflet-legendcontrol.js \
    ../../resources/mapthing/js/map.js \
    ../../resources/mapthing/js/tour.js \
    ../../resources/vendors/bootstrap/js/bootstrap.js \
    ../../resources/vendors/bootstrap/js/bootstrap.min.js \
    ../../resources/vendors/bootstrap/js/npm.js \
    ../../resources/vendors/bootstrap-tour/js/bootstrap-tour.min.js \
    ../../resources/vendors/jquery-loading-overlay/loadingoverlay.js \
    ../../resources/vendors/jquery-loading-overlay/loadingoverlay.min.js \
    ../../resources/vendors/js/bootbox.min.js \
    ../../resources/vendors/js/bootstrap-select.min.js \
    ../../resources/vendors/js/handlebars.runtime-v4.0.5.js \
    ../../resources/vendors/js/jquery-1.11.3.min.js \
    ../../resources/vendors/js/jquery-sidebar.js \
    ../../resources/vendors/js/leaflet-search.src.js \
    ../../resources/vendors/js/leaflet-sidebar.js \
    ../../resources/vendors/js/leaflet-sidebar_old.js \
    ../../resources/vendors/js/leaflet-wms-getlegendgraphic.js \
    ../../resources/vendors/L.Geosearch/js/l.control.geosearch.js \
    ../../resources/vendors/L.Geosearch/js/l.geosearch.provider.bing.js \
    ../../resources/vendors/L.Geosearch/js/l.geosearch.provider.esri.js \
    ../../resources/vendors/L.Geosearch/js/l.geosearch.provider.google.js \
    ../../resources/vendors/L.Geosearch/js/l.geosearch.provider.nokia.js \
    ../../resources/vendors/L.Geosearch/js/l.geosearch.provider.openstreetmap.js \
    ../../resources/vendors/L.Loading/Control.Loading.js \
    ../../resources/vendors/Leaflet/leaflet-src.js \
    ../../resources/vendors/Leaflet/leaflet.js \
    ../../resources/vendors/MarkerCluster/leaflet.markercluster-src.js \
    ../../resources/vendors/MarkerCluster/leaflet.markercluster.js \
    ../../resources/vendors/plotly/plotly.min.js \
    ../../resources/vendors/PruneCluster/PruneCluster.js \
    ../../resources/vendors/PruneCluster/PruneCluster.min.js \
    ../../resources/mapthing/conf/baselayers.json \
    ../../resources/mapthing/conf/wms.json \
    ../../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.eot \
    ../../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.ttf \
    ../../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.woff \
    ../../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.woff2 \
    ../../resources/vendors/font-awesome-4.5.0/fonts/fontawesome-webfont.eot \
    ../../resources/vendors/font-awesome-4.5.0/fonts/fontawesome-webfont.ttf \
    ../../resources/vendors/font-awesome-4.5.0/fonts/fontawesome-webfont.woff \
    ../../resources/vendors/font-awesome-4.5.0/fonts/fontawesome-webfont.woff2 \
    ../../resources/vendors/font-awesome-4.5.0/fonts/FontAwesome.otf \
    ../../resources/mapthing/img/big_roller.gif \
    ../../resources/mapthing/img/loader.gif \
    ../../resources/vendors/jquery-loading-overlay/loading.gif \
    ../../resources/mapthing/img/blank.png \
    ../../resources/mapthing/img/ffa500-marker-32.png \
    ../../resources/mapthing/img/layers.png \
    ../../resources/mapthing/img/search-icon.png \
    ../../resources/vendors/Leaflet/images/layers-2x.png \
    ../../resources/vendors/Leaflet/images/layers.png \
    ../../resources/vendors/Leaflet/images/marker-icon-2x.png \
    ../../resources/vendors/Leaflet/images/marker-icon.png \
    ../../resources/vendors/Leaflet/images/marker-shadow.png \
    ../../resources/vendors/bootstrap/fonts/glyphicons-halflings-regular.svg \
    ../../resources/vendors/font-awesome-4.5.0/fonts/fontawesome-webfont.svg \
    ../../resources/mapthing/css/leaflet-legendcontrol.css \
    ../../resources/mapthing/css/leaflet-search.src.css \
    ../../resources/mapthing/css/main.css \
    ../../resources/vendors/bootstrap/css/bootstrap-theme.css \
    ../../resources/vendors/bootstrap/css/bootstrap-theme.min.css \
    ../../resources/vendors/bootstrap/css/bootstrap.css \
    ../../resources/vendors/bootstrap/css/bootstrap.min.css \
    ../../resources/vendors/bootstrap-tour/css/bootstrap-tour.min.css \
    ../../resources/vendors/css/bootstrap-select.min.css \
    ../../resources/vendors/css/leaflet-sidebar.css \
    ../../resources/vendors/font-awesome-4.5.0/css/font-awesome.css \
    ../../resources/vendors/font-awesome-4.5.0/css/font-awesome.min.css \
    ../../resources/vendors/L.Geosearch/css/l.geosearch.css \
    ../../resources/vendors/L.Loading/Control.Loading.css \
    ../../resources/vendors/Leaflet/leaflet.css \
    ../../resources/vendors/MarkerCluster/MarkerCluster.css \
    ../../resources/vendors/MarkerCluster/MarkerCluster.Default.css \
    ../../resources/vendors/PruneCluster/LeafletStyleSheet.css \
    ../../resources/mapthing/templates/modal.handlebars \
    ../../resources/vendors/bootstrap/css/bootstrap-theme.css.map \
    ../../resources/vendors/bootstrap/css/bootstrap.css.map \
    ../../resources/vendors/css/bootstrap-select.css.map \
    ../../resources/vendors/js/bootstrap-select.js.map \
    ../../resources/vendors/PruneCluster/PruneCluster.js.map \
    ../../resources/index.html \
    ../../resources/vendors/bootstrap-modal/js/bootstrap-modal.js \
    ../../resources/vendors/bootstrap-modal/js/bootstrap-modalmanager.js \
    ../../resources/vendors/jquery-ui-1.11.4/jquery-ui.min.js \
    ../../resources/vendors/bootstrap-modal/css/bootstrap-modal-bs3patch.css \
    ../../resources/vendors/bootstrap-modal/css/bootstrap-modal.css \
    ../../resources/vendors/jquery-ui-1.11.4/jquery-ui.min.css \
    ../../resources/vendors/jquery-ui-1.11.4/jquery-ui.structure.css \
    ../../resources/vendors/jquery-ui-1.11.4/jquery-ui.structure.min.css \
    ../../resources/vendors/jquery-ui-1.11.4/jquery-ui.theme.css \
    ../../resources/vendors/jquery-ui-1.11.4/jquery-ui.theme.min.css
