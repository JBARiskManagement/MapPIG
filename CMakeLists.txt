cmake_minimum_required(VERSION 3.1.0)
project(mapthing)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)

# Instruct CMake to run moc automatically when needed.
set(CMAKE_AUTOMOC ON)
# As moc files are generated in the binary dir, tell CMake
# to always look for includes there:
set(CMAKE_INCLUDE_CURRENT_DIR ON)

# Find the Qt directories
find_package(Qt5Widgets REQUIRED)
find_package(Qt5WebKitWidgets REQUIRED)
find_package(Qt5Svg REQUIRED)
find_package(Qt5Sql REQUIRED)

foreach (dir ${Qt5Widgets_INCLUDE_DIRS})
  message(${dir})
endforeach()

include_directories("${PROJECT_SOURCE_DIR}/src/libmapthing")
include_directories("${PROJECT_SOURCE_DIR}/src/gui")

# Run grunt to package the javascript before anything else
add_custom_target(
    jsTasks
    COMMAND grunt --gruntfile "${PROJECT_SOURCE_DIR}/Gruntfile.js"    
)

file (GLOB LIBSOURCES "src/libmapthing/*.cpp" "src/libmapthing/*.c")
add_library(libmapthing ${LIBSOURCES})
qt5_use_modules(libmapthing Widgets Sql)
add_dependencies(libmapthing jsTasks)

file (GLOB GUISOURCES "src/gui/*.cpp")
add_executable(mapthing WIN32 ${GUISOURCES})
target_link_libraries(mapthing libmapthing)
qt5_use_modules(mapthing Widgets WebKitWidgets Svg Sql)

