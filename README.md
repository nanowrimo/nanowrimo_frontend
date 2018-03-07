# NaNoWriMo Frontend

[![TravisCI](https://api.travis-ci.org/nanowrimo/nanowrimo_frontend.svg?branch=master)](https://travis-ci.org/nanowrimo/nanowrimo_frontend) [![Greenkeeper badge](https://badges.greenkeeper.io/nanowrimo/nanowrimo_frontend.svg)](https://greenkeeper.io/)

This is an Ember.js frontend for the new NaNoWriMo web app.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone git@github.com:nanowrimo/nanowrimo_frontend.git` this repository
* `cd nanowrimo_frontend`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

**Note:** This project includes [ember-chrome-devtools](https://github.com/dwickern/ember-chrome-devtools)
which improves the console output of the Ember Inspector. To use, check "Enable custom formatters" in the Chrome DevTools Settings (under the "Console" heading).

### API Development

By default, `ember serve` will build and run against a mock API server using [ember-cli-mirage](http://www.ember-cli-mirage.com/). To run the app against a live API, use the following environment arguments:

* Local API (`localhost:3000`): `ember serve -e development-local`
* Production API (`api.nanowrimo.org`): `ember serve -e development-api`

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Deployment occurs automatically when TravisCI builds the `master` branch. TravisCI executes the `ember deploy production` command provided by the [ember-cli-deploy](http://ember-cli-deploy.com/) addon and configured via the [ember-cli-deploy-s3-pack](https://github.com/gaurav0/ember-cli-deploy-s3-pack) to build and upload the `index.html` and compiled assets to AWS S3. All AWS configuration keys are stored on TravisCI, so there is no need to pass them between developers.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
* Addons
  * [EmberAddons.com](https://www.emberaddons.com/)
  * [EmberObserver.com](https://emberobserver.com/)
