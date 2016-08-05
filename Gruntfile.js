module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
              options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
              },
              dist: {
                // the files to concatenate
                src: ['resources/mapthing/js/map.js', 
                      'resources/mapthing/js/dom.js',
                      'resources/mapthing/js/tour.js',
                      'resources/mapthing/js/bubblelayer.js',
                      'resources/mapthing/js/datalayer.js',
                      'resources/mapthing/js/layerpanel.js',
                      'resources/mapthing/js/leaflet-legendcontrol.js',
                      'resources/mapthing/js/templates.js'],
                // the location of the resulting JS file
                dest: 'resources/mapthing/dist/<%= pkg.name %>.js'
              }
            },
    uglify: {
              options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true
              },
              dist: {
                files: {
                'resources/mapthing/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
              }
            },    
    cssmin: {
              options: {
                    sourceMap: true
                  },
              combine: {
                  files:{
                        'resources/mapthing/dist/mapthing.min.css': ['resources/mapthing/css/*.css']                
                        }
                  }
            },
    jshint: {
              // define the files to lint
              files: ['gruntfile.js', 'resources/mapthing/js/*.js', '!resources/mapthing/js/templates.js'],
              // configure JSHint (documented at http://www.jshint.com/docs/)
              options: {
                  // more options here if you want to override JSHint defaults
                globals: {
                  jQuery: true,
                  console: true,
                  module: true
                }
              }
            },
    handlebars: { compile: {
                    files: {
                                'resources/mapthing/js/templates.js': ['resources/mapthing/templates/*.handlebars']
                            },
                    options: {
                                namespace: "MT.templates",
                                processName: function(filePath) {
                                    console.log(filePath);
                                    var pieces = filePath.split('/');
                                    return pieces[pieces.length - 1].split('.')[0];
                                  }   
                            },
                        
                    }                   
                }
    
  });

  // Load plugins for the tasks
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['handlebars', 'jshint', 'concat', 'uglify', 'cssmin:combine']);

};