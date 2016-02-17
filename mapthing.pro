TEMPLATE = subdirs
SUBDIRS = gui \
          lib
          
gui.subdir = src/gui
lib.subdir = src/libmapthing

gruntbuild.target = gruntbuild
gruntbuild.commands = grunt --gruntfile $$PWD/Gruntfile.js

gui.depends = lib

PRE_TARGETDEPS  = gruntbuild
QMAKE_EXTRA_TARGETS += gruntbuild


CONFIG(debug, debug|release) {
DESTDIR = ../bin

}
CONFIG(release, debug|release) {
DESTDIR = ../bin

}
