const debug = require('debug')('push2cloud-compiler-git-ref-env');
const path = require('path');
const fs = require('fs');

const ref = (dir, releaseMani, next) => {
  if (!releaseMani.source || releaseMani.source.type !== 'git') return next(null, releaseMani);

  const pathToReleaseManifest = path.join(dir, 'releaseManifest.json');

  if (process.env.GIT_REF) {
    releaseMani.source.referenceValue = process.env.GIT_REF;
  }

  // force to re-require this file
  delete require.cache[require.resolve(pathToReleaseManifest)];

  debug(`writing ${pathToReleaseManifest}...`);
  fs.writeFile(pathToReleaseManifest, JSON.stringify(releaseMani, null, 2), (err) => {
    next(err, releaseMani);
  });
};

module.exports = {
  afterGetReleaseManifest: ref
};
