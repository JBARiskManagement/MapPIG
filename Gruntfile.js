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
                src: ['js/map.js', 
                      'js/dom.js',
                      'js/tour.js',
                      'js/bubblelayer.js',
                      'js/datalayer.js',
                      'js/layerpanel.js',
                      'js/leaflet-legendcontrol.js',
                      'js/templates.js'],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
              }
            },
    uglify: {
              options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true
              },
              dist: {
                files: {
                'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
              }
            },    
    cssmin: {
              options: {
                    sourceMap: true
                  },
              combine: {
                  files:{
                        'dist/mapthing.min.css': ['css/*.css']                
                        }
                  }
            },
    jshint: {
              // define the files to lint
              files: ['gruntfile.js', 'js/*.js', '!js/templates.js'],
              // configure JSHint (documented at http://www.jshint.com/docs/)
              options: {
                  // more options here if you want to override JSHint defaults
                globals: {
                  jQuery: true,
                  console: true,
                  module: true,
                  reporterOutput: ""
                }
              }
            },
    handlebars: { compile: {
                    files: {
                                'js/templates.js': ['templates/*.handlebars']
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