var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    babelify = require('babelify'),
    watchify = require('watchify'),
    exorcist = require('exorcist'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    dotenv = require('dotenv'),
    fs = require('fs'),
    vueify = require('vueify'),
    autoprefixer = require('gulp-autoprefixer'),
    reload = browserSync.reload,
    bourbon = require('node-bourbon').includePaths;

// Check environments variables
fs.stat('.env', function(err, stat) {
    if (err == null) {
        // There's no need to check if .env exists, dotenv will check this // for you. It will show a small warning which can be disabled when // using this in production.
        dotenv.load(); //load vars to process.env
    } else if (err.code == 'ENOENT') {
        // file does not exist
        fs.createReadStream('.sample-env').pipe(fs.createWriteStream('.env', { mode: 0o755 }));
        // There's no need to check if .env exists, dotenv will check this // for you. It will show a small warning which can be disabled when // using this in production.
        dotenv.load(); //load vars to process.env
    } else {
        console.log('Reading .env file error: ', err.code);
    }
});

// Watchify args contains necessary cache options to achieve fast incremental bundles.
// See watchify readme for details. Adding debug true for source-map generation.
watchify.args.debug = true;
// Input file.
var bundler = watchify(browserify('./src/bundle.js', watchify.args));

// Babel transform
bundler.transform( babelify.configure({
    sourceMapsAbsolute: true,
    presets: ["es2015"]
})).transform( vueify, {_flags: {debug: true}});

// On updates recompile
bundler.on('update', bundle);

// Source variables
var src = {
    scss: 'src/scss/**/*.scss',
    css:  'dist',
    html: '*.html'
};

function bundle() {
    gutil.log('Compiling JS...');
    gutil.log('Environment: '+process.env.NODE_ENV);

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(exorcist('dist/bundle.js.map'))
        .pipe(source('build.js'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({once: true}));
}

// SASS Styles
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe(sass({
            includePaths: ['./node_modules/font-awesome/scss', bourbon]
        }).on('error', sass.logError))
        .pipe(plumber())
        .pipe(rename({basename: 'build'}))
        .pipe(browserSync.stream())
        .pipe(gulp.dest(src.css));
});

//Fonts
gulp.task('fonts', function() {
    return gulp.src([
        './node_modules/font-awesome/fonts/fontawesome-webfont.*',
        './node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.*'
    ])
        .pipe(gulp.dest('dist/fonts/'));
});

// Bundle task
gulp.task('bundle',['sass','create-config'], function () {
    return bundle();
});

// Dev Build
gulp.task('default', ['bundle','fonts'], function () {
    browserSync.init({
        // Proxy app
        proxy: '0.0.0.0:8080',
        port: 3000,
        injectChanges: true,
        open: false
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', reload);
});


/** Production building **/
gulp.task('production-build-browserify', function () {
    gutil.log('Building production minified files...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(exorcist('dist/bundle.js.map'))
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(
            uglify({
            mangle: true,
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: true
            }
            })
        )
        .pipe(gulp.dest('dist'));
});

gulp.task('production-build-sass', function() {
    return gulp.src(src.scss)
        .pipe(sass({
            includePaths: ['./node_modules/font-awesome/scss', bourbon]
        }).on('error', sass.logError))
        .pipe(plumber())
        .pipe(sass({
            includePaths: ['scss'].concat()
        }))
        .pipe(autoprefixer({
            browsers : ['last 2 versions'],
            cascade  : false
        }))
        .pipe(minifycss())
        .pipe(rename({basename: 'build'}))
        .pipe(gulp.dest(src.css));
});

gulp.task('build', ['create-config','production-build-browserify','production-build-sass'], function () {
    gutil.log('Closing process...');
    process.exit();
});

/*** Environment settings ***/
gulp.task('create-config', function(cb) {
    function returnConfig( config ) {
        var _config = {
            environment: config.NODE_ENV,
            loginPath: config.LOGIN_PATH,
            signupPath: config.SIGNUP_PATH,
            sessionApiPath: config.SESSION_PATH,
            masterKey: config.MASTER_KEY
        };

        switch (config.NODE_ENV){
            case 'development':
                _config.apiUrl = config.DEVELOPMENT_API_URL;
                break;

            case 'staging':
                _config.apiUrl = config.STAGING_API_URL;
                break;

            case 'testing':
                _config.apiUrl = config.TESTING_API_URL;
                break;

            case 'production':
                _config.apiUrl = config.PRODUCTION_API_URL;
                break;
        }

        return _config;
    }

    fs.writeFile('config.json', JSON.stringify(returnConfig( dotenv.config().parsed )), cb);
});
