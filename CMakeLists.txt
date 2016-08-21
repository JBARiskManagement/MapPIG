cmake_minimum_required(VERSION 3.1.0)
project(mapthing)

# Run grunt to package the javascript before anything else
add_custom_target(
    jsTasks
    COMMAND grunt --gruntfile "${PROJECT_SOURCE_DIR}/Gruntfile.js"    
)

