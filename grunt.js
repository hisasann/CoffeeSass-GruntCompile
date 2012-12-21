// npm instlal grunt
// grunt watch

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // ------------------------------------------------------------------------
    meta: {
      version: '0.1.0',
      banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://PROJECT_WEBSITE/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'hisasann; Licensed MIT */'
    },
    // ------------------------------------------------------------------------
    coffee: {
      app: {
        src : ['coffee/index.coffee'],
        dest : 'Resources/js/index.js'
      },
      sample: {
        src : ['coffee/sample/**/*coffee'],
        dest : 'coffee/sample/*.js'
      }
    },
    // ------------------------------------------------------------------------
    compass: {
      dev: {
        src: 'scss',
        dest: 'Resources/css',
        linecomments: true,
        forcecompile: true,
        require: [
        ],
        debugsass: true,
        images: '',
        relativeassets: true
      },
      prod: {
        src: 'scss',
        dest: 'Resources/css',
        outputstyle: 'compressed',
        linecomments: false,
        forcecompile: true,
        require: [
        ],
        debugsass: false,
        images: '',
        relativeassets: true
      }
    },
    // ------------------------------------------------------------------------
    concat: {
      sample1: {
        src: ['<banner:meta.banner>', 'coffee/sample/sample1.js'],
        dest: 'coffee/sample/sample1.js'
      },
      sample2: {
        src: ['<banner:meta.banner>', 'coffee/sample/sample2.js'],
        dest: 'coffee/sample/sample2.js'
      },
      sampleall: {
        src: ['coffee/sample/*.js'],
        dest: 'coffee/sample/all/sample-all.js'
      }
    },
    // ------------------------------------------------------------------------
    min: {
      sample: {
        src: ['coffee/sample/sample-all.js'],
        dest: 'Resources/js/sample/sample-all.min.js'
      }
    },
    // ------------------------------------------------------------------------
    watch:{
      coffee:{
        files:['coffee/**/*.coffee'],
        tasks:'coffee concat min'
      },
      compass:{
        files:['scss/**/*.scss'],
//         tasks:'compass'
        tasks: ['compass-dev']
      }
    },
    // ------------------------------------------------------------------------
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  // load npm tasks.
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-compass');

  // compass task.
  grunt.registerTask('compass-dev', ['compass-clean', 'compass:dev']);
  grunt.registerTask('compass-prod', ['compass-clean', 'compass:prod']);

  // Default task.
  grunt.registerTask('default', 'coffee compass-dev concat min');
};

