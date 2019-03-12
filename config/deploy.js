/* jshint node: true */

module.exports = function(deployTarget) { // eslint-disable-line no-unused-vars

  var assetsBucket;
  var indexBucket;
  if (process.env.TARGET=='staging') {
    assetsBucket = process.env.ASSETS_STAGING_BUCKET;
    indexBucket = process.env.INDEX_STAGING_BUCKET;
  } else {
    assetsBucket = process.env.ASSETS_PRODUCTION_BUCKET;
    indexBucket = process.env.INDEX_PRODUCTION_BUCKET;
  }
  
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
      filePattern: '**/*.{m4a,ogg,mp3,js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,wasm}',
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
