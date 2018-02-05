/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: "production"
    },
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary for ember-cli-deploy-s3-index to activate the index.html.
      activateOnDeploy: true
    },
    "revision-data": {
      "type": "version-commit"
    },
    s3: {
      accessKeyId: process.env.ASSETS_PRODUCTION_AWS_KEY,
      secretAccessKey: process.env.ASSETS_PRODUCTION_AWS_SECRET,
      bucket: process.env.ASSETS_PRODUCTION_BUCKET,
      region: process.env.ASSETS_PRODUCTION_REGION
    },
    "s3-index": {
      accessKeyId: process.env.INDEX_PRODUCTION_AWS_KEY,
      secretAccessKey: process.env.INDEX_PRODUCTION_AWS_SECRET,
      bucket: process.env.INDEX_PRODUCTION_BUCKET,
      region: process.env.INDEX_PRODUCTION_REGION
    }
  };

  if (deployTarget === 'staging') {
    // Add staging-specific deploy configuration
  }

  if (deployTarget === 'production') {
    // Add production-specific deploy configuration
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
