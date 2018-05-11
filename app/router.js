import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('authenticated', { path: '' }, function() {
    this.route('genres', function() {
      this.route('new');
      this.route('show', { path: '/:genre_id' });
      this.route('edit', { path: '/:genre_id/edit' });
    });

    this.route('users', { path: 'participants'}, function() {
      this.route('show', { path: '/:name'}, function() {
        this.route('projects', function() {
        });
      });
      this.route('edit');
      
    });
    this.route('current-user', function() {
      this.route('show', { path: '/' });
    });
  });

  //email confirmations
  this.route('confirm-email');

  this.route('index', { path: '/' });
  this.route('sign-up');
  this.route('sign-in');
  this.route('404');
  this.route('not-found', { path: '/*path' });
  this.route('error');
  this.route('forgot-password');
  this.route('password-reset');
});

export default Router;
