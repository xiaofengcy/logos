/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top  */
var fs = require('fs');
var exec = require('child_process').exec;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _orderBy = require('lodash/orderBy');
var _take = require('lodash/take');
var del = require('del');
var request = require('sync-request');
var merge = require('merge-stream');
var vinylPaths = require('vinyl-paths');

var commitMessage;

gulp.task('readme', function() {
  var fetch = request('GET', 'https://logos-c87b5.firebaseio.com/items.json');

  var items = JSON.parse(fetch.getBody('utf8')),
    logos = _orderBy(items, ['updated', 'name'], ['desc', 'asc']);

  logos = _take(logos.filter(d => d.public), 50);

  return gulp.src('./README.handlebars')
    .pipe($.compileHandlebars(logos, {
      batch: ['./'],
    }))
    .pipe($.rename('README.md'))
    .pipe(gulp.dest('../'));
});

gulp.task('get-commit', function(cb) {
  exec('git log -1 --pretty=%s && git log -1 --pretty=%b', function(err, stdout) {
    var parts = stdout.replace('\n\n', '').split('\n');

    commitMessage = parts[0];
    if (parts[1]) {
      commitMessage += ' — ' + parts[1];
    }

    cb(err);
  });
});

gulp.task('gh-master', function() {
  var clean,
    push;

  clean = gulp.src('.master/.DS_Store')
    .pipe(vinylPaths(del));

  push = gulp.src([
    'logos/**/*.svg',
    'README.md',
    'LICENSE.txt',
  ], { base: './' })
    .pipe($.ghPages({
      branch: 'master',
      cacheDir: '.master',
      message: commitMessage,
      force: true,
    }));

  return merge(clean, push);
});
