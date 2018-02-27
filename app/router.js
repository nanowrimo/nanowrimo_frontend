import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('authenticated', { path: '' }, function() {
    this.route('genres');
  });

  this.route('sign-up');
  this.route('sign-in');

  this.route('index', { path: '/' });
});

export default Router;
