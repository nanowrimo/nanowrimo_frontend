/* jshint node: true */

module.exports = function(deployTarget) {
  var assetsBucket;
  var indexBucket;
  var bEnv = "production";
  if (deployTarget === 'staging') {
    assetsBucket = process.env.ASSETS_STAGING_BUCKET;
    indexBucket = process.env.INDEX_STAGING_BUCKET;
    bEnv = "production";
  }
  if (deployTarget === 'production') {
    assetsBucket = process.env.ASSETS_PRODUCTION_BUCKET;
    indexBucket = process.env.INDEX_PRODUCTION_BUCKET;
  }
  
  
  var ENV = {
    build: {
      environment: bEnv
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
      bucket: assetsBucket,
      region: process.env.ASSETS_PRODUCTION_REGION
    },
    "s3-index": {
      accessKeyId: process.env.INDEX_PRODUCTION_AWS_KEY,
      secretAccessKey: process.env.INDEX_PRODUCTION_AWS_SECRET,
      bucket: indexBucket,
      region: process.env.INDEX_PRODUCTION_REGION
    }
  };


  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
