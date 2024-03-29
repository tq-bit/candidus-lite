const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');
const path = require('path');
const releaseUtils = require('@tryghost/release-utils');
const inquirer = require('inquirer');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const beeper = require('beeper');
const fs = require('fs');

// postcss plugins
const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-mod-function');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');

const REPO = 'TryGhost/Casper';
const REPO_READONLY = 'TryGhost/Casper';
const CHANGELOG_PATH = path.join(process.cwd(), '.', 'changelog.md');

function serve(done) {
  livereload.listen();
  done();
}

const handleError = (done) => {
  return function (err) {
    if (err) {
      beeper();
    }
    return done(err);
  };
};

function hbs(done) {
  pump([src(['*.hbs', 'partials/**/*.hbs']), livereload()], handleError(done));
}

function css(done) {
  pump(
    [
      src('assets/css/main.css', { sourcemaps: true }),
      postcss([easyimport, colorFunction(), autoprefixer(), cssnano()]),
      concat('main.css'),
      dest('assets/built/', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function fonts(done) {
  pump(
    [
      src('assets/css/fonts.css', { sourcemaps: true }),
      concat('fonts.css'),
      dest('assets/built/', { sourcemaps: '.' }),
    ],
    handleError(done)
  );
  pump(
    [src('assets/css/fonts/**/*'), dest('assets/built/fonts/')],
    handleError(done)
  );
}

function buildJsModules(done) {
  pump(
    [
      src(['assets/js/modules/*.js'], { sourcemaps: true }),
      concat('modules.js'),
      babel(),
      uglify(),
      dest('assets/built/', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function buildJsLib(done) {
  pump(
    [
      src(['assets/js/lib/*.js'], { sourcemaps: true }),
      concat('lib.js'),
      babel(),
      uglify(),
      dest('assets/built/', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function buildJsCore(done) {
  pump(
    [
      src(['assets/js/partials/*.js', 'assets/js/index.js'], {
        sourcemaps: true,
      }),
      concat('main.js'),
      babel(),
      uglify(),
      dest('assets/built/', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function indexworker(done) {
  pump(
    [
      src(
        ['assets/js/modules/lunr.min.js', 'assets/js/workers/indexworker.js'],
        { sourcemaps: true }
      ),
      concat('indexworker.js'),
      babel(),
      uglify(),
      dest('assets/built/workers', { sourcemaps: '.' }),
      livereload(),
    ],
    handleError(done)
  );
}

function zipper(done) {
  const filename = require('./package.json').name + '.zip';

  pump(
    [
      src([
        '**',
        '!node_modules',
        '!node_modules/**',
        '!dist',
        '!dist/**',
        '!yarn-error.log',
        '!yarn.lock',
        '!gulpfile.js',
      ]),
      zip(filename),
      dest('dist/'),
    ],
    handleError(done)
  );
}

const cssWatcher = () => watch('assets/css/**', css);
const fontsWatcher = () => watch('assets/css/**', fonts);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const jsModuleWatcher = () => watch(['assets/js/modules/*.js'], buildJsModules);
const jsLibWatcher = () => watch(['assets/js/lib/*.js'], buildJsLib);
const jsPartialWatcher = () => watch(['assets/js/partials/*.js'], buildJsCore);
const jsWorkerWatcher = () => watch(['assets/js/workers/*.js'], indexworker);
const watcher = parallel(
  cssWatcher,
  fontsWatcher,
  hbsWatcher,
  jsModuleWatcher,
  jsLibWatcher,
  jsPartialWatcher,
  jsWorkerWatcher
);
const build = series(
  css,
  buildJsModules,
  buildJsLib,
  buildJsCore,
  indexworker,
  fonts
);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);

exports.release = async () => {
  // @NOTE: https://yarnpkg.com/lang/en/docs/cli/version/
  // require(./package.json) can run into caching issues, this re-reads from file everytime on release
  let packageJSON = JSON.parse(fs.readFileSync('./package.json'));
  const newVersion = packageJSON.version;

  if (!newVersion || newVersion === '') {
    console.log(`Invalid version: ${newVersion}`);
    return;
  }

  console.log(`\nCreating release for ${newVersion}...`);

  const githubToken = process.env.GST_TOKEN;

  if (!githubToken) {
    console.log(
      'Please configure your environment with a GitHub token located in GST_TOKEN'
    );
    return;
  }

  try {
    const result = await inquirer.prompt([
      {
        type: 'input',
        name: 'compatibleWithGhost',
        message: 'Which version of Ghost is it compatible with?',
        default: '4.0.0',
      },
    ]);

    const compatibleWithGhost = result.compatibleWithGhost;

    const releasesResponse = await releaseUtils.releases.get({
      userAgent: 'Casper',
      uri: `https://api.github.com/repos/${REPO_READONLY}/releases`,
    });

    if (!releasesResponse || !releasesResponse) {
      console.log('No releases found. Skipping...');
      return;
    }

    let previousVersion =
      releasesResponse[0].tag_name || releasesResponse[0].name;
    console.log(`Previous version: ${previousVersion}`);

    const changelog = new releaseUtils.Changelog({
      changelogPath: CHANGELOG_PATH,
      folder: path.join(process.cwd(), '.'),
    });

    changelog
      .write({
        githubRepoPath: `https://github.com/${REPO}`,
        lastVersion: previousVersion,
      })
      .sort()
      .clean();

    const newReleaseResponse = await releaseUtils.releases.create({
      draft: true,
      preRelease: false,
      tagName: 'v' + newVersion,
      releaseName: newVersion,
      userAgent: 'Casper',
      uri: `https://api.github.com/repos/${REPO}/releases`,
      github: {
        token: githubToken,
      },
      content: [`**Compatible with Ghost ≥ ${compatibleWithGhost}**\n\n`],
      changelogPath: CHANGELOG_PATH,
    });
    console.log(
      `\nRelease draft generated: ${newReleaseResponse.releaseUrl}\n`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
