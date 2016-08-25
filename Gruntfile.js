module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), 
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
                                'js/templates.js': ['assets/templates/*.handlebars']
                            },
                    options: {
                                namespace: "templates",
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['handlebars', 'jshint', 'cssmin:combine']);

};