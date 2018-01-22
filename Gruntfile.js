module.exports = function(grunt) {


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    sass: {
      options: {
      },
      compile: {
        files: {
          'files/all.css': 'styles/all.scss',
        }
      }
    },

    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: ['scripts/components/**/*.js', 'scripts/app.js'],
        dest: 'files/app.js',
      },
    },

    
    babel: {
      options: {
        presets: ['env', 'react'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
      },
      compile: {
        files: {
          'files/app.js': 'files/app.js',
        }
      }
    },


    watch: {
      options: {
        livereload: true,
        interrupt: true,
        debounceDelay: 120
      },
      html: {
        files: 'layouts/**/*.html'
      },
      sass: {
        files: 'styles/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: false
        }
      },
      css: {
        files: 'files/all.css'
      },
      babel: {
        files: 'scripts/**/*.js',
        tasks: ['concat', 'babel']
      }
    }


  });


  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'babel', 'sass', 'watch']);
  grunt.registerTask('scripts', ['concat', 'babel']);
};



