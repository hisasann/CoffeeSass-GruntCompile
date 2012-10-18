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
        dest : 'Resources/js/'
      },
      sample: {
        src : ['coffee/sample/*.coffee'],
        dest : 'coffee/sample/'
      }
    },
    // ------------------------------------------------------------------------
    compass: {
      sample: {
        src : ['scss'],
        dest : 'Resources/css'
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
        dest: 'coffee/sample/sample-all.js'
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
        tasks:'compass'
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

  // Default task.
  grunt.registerTask('default', 'coffee compass concat min');

  // --------------------------------------------------------------------------
  //
  // register custom tasks and helpers.
  //

  var log = grunt.log;
  var exec = require('child_process').exec;

  grunt.registerHelper('exec', function (opts, done) {
    var command = opts.cmd + ' ' + opts.args.join(' ');
    exec(command, opts.opts, function (code, stdout, stderr) {
      if (!done) return;
      if (code === 0) {
        done(null, stdout, code);
      } else {
        done(code, stderr, code);
      }
    });
  });

  var handleResult = function handleResult(err, stdout, code, done) {
    if (err) {
      log.writeln(stdout);
      done(false);
    } else {
      log.writeln('complete!');
      done(true);
    }
  };

  // task: coffee
  (function (grunt) {
    grunt.registerHelper('coffeec', function (fromdir, dest, done) {
      var args = { cmd:'coffee', args:[ '--compile', '--output', dest, fromdir ] };
      grunt.helper('exec', args, function (err, stdout, code) {
        handleResult(err, stdout, code, done);
      });
    });

    grunt.registerMultiTask('coffee', 'compile CoffeeScript', function () {
      grunt.helper('coffeec', this.data.src, this.data.dest, this.async());
    });
  }(grunt));

  // task: sass
  (function (grunt) {
    grunt.registerHelper('sassc', function (from, dest, done) {
      var args = { cmd:'sass', args:[ from + ':' + dest] };
      grunt.helper('exec', args, function (err, stdout, code) {
        handleResult(err, stdout, code, done);
      });
    });

    grunt.registerMultiTask('sass', 'compile sass', function () {
      grunt.helper('sassc', this.data.src, this.data.dest, this.async());
    });
  }(grunt));

  // task: compass
  // gem install compass
  (function (grunt) {
    grunt.registerHelper('compassc', function (fromdir, destdir , done) {
      var args = { cmd:'compass compile', args:[ '--sass-dir ' + fromdir + ' --css-dir ' + destdir + ' --boring' ] };
      grunt.helper('exec', args, function (err, stdout, code) {
        handleResult(err, stdout, code, done);
      });
    });

    grunt.registerMultiTask('compass', 'compile sass', function () {
      grunt.helper('compassc', this.data.src, this.data.dest, this.async());
    });
  }(grunt));

};

