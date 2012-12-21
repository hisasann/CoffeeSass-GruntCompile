# grunt.jsの使い方

## package.json を作成する

    npm init

### package.json のサンプル

だいたい以下のようになる

    {
      "name": "Coffee-Scss-Grunt-Buildup",
      "version": "0.0.1",
      "author": "hisasann",
      "license": "BSD",
      "description": "ERROR: No README.md file found!",
      "main": "grunt.js",
      "dependencies": {
        "grunt": "*",
        "grunt-contrib": "*",
        "grunt-sass": "*",
        "grunt-compass": "*"
      },
      "devDependencies": {},
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "repository": {
        "type": "git",
        "url": "git://github.com/hisasann/CoffeeSass-GruntCompile.git"
      }
    }

*CoffeeScript* と *Sass* をコンパイルするので、

* [grunt-contrib](https://github.com/gruntjs/grunt-contrib)
* [grunt-sass](https://github.com/sindresorhus/grunt-sass)
* [grunt-compass](https://github.com/kahlil/grunt-compass)

これらも dependencies に含めている

grunt-coffee を入れていないのは、再帰的な階層をコンパイルする方法がうまく動かなかったため

## インストールする

    npm install

必要なパッケージが、 ./node_modules以下にに配置される

のちのち

    grunt.loadNpmTasks('grunt-coffee');

のように task を呼び出すときには、必ず grunt.js が置いてあるディレクトリに、 *node_modules* があること

    npm install grunt-coffee

として、ローカルにインストールしても呼び出すことはできない


---

#taskをnpmで入れるのが面倒な方へ

以下のように、taskを登録することもできる

こであれば、package.json を作らずとも、 grunt.jsに直接書き込めばよい

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

    task: sass
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

    task: compass
    gem install compass
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

#grunt.jsを使う

grunt.js があるディレクトリで

    grunt

これだけでよい

また、watch させたい場合は、

    grunt watch

とすればよい
