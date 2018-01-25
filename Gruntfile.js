module.exports = function(grunt) {

  const path = grunt.option('path') || '';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
      },
      compile: {
        src: `${path}styles/all.scss`,
        dest: `${path}files/all.css`
      }
    },

    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: [`${path}scripts/components/**/*.js`, `${path}scripts/app.js`],
        dest: `files/app.js`,
      },
    },

    
    babel: {
      options: {
        presets: ['env', 'react'],
        plugins: ['transform-object-rest-spread', 'transform-class-properties']
      },
      compile: {
        src: `files/app.js`,
        dest: `${path}files/app.js`
      }
    },


    watch: {
      options: {
        livereload: true,
        interrupt: true,
        forever: false
      },
      html: {
        files: `${path}layouts/**/*.html`
      },
      sass: {
        files: `${path}styles/**/*.scss`,
        tasks: ['sass'],
        options: {
          livereload: false
        }
      },
      css: {
        files: `${path}files/all.css`,
        options: {
          spawn: false
        }
      },
      babel: {
        files: `${path}scripts/**/*.js`,
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



