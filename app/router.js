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
    this.route('projects', function() {
      this.route('new');
    });


    this.route('users', { path: 'participants'}, function() {
      this.route('show', { path: '/:slug'}, function() {
        this.route('projects', function() {
          this.route('show', { path: '/:project_slug'}, function(){
            this.route('goals');
            this.route('badges');
          });
        });
        this.route('buddies', function() {
        });
      });
      this.route('edit');
    });
    this.route('stats', function() {
    });
    this.route('locations', { path: 'locations'}, function() {
    });
    this.route('regions', function() {
      this.route('find');
      this.route('leaderboard');
      this.route('show', { path: '/:slug'}, function() {
        this.route('events');
        this.route('members');
      });
    });
    this.route('project',function(){
      this.route('show', { path: '/:project_slug'}, function(){});
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
  this.route('resend-confirmation-email');
  this.route('password-reset');
  this.route('components.stats', { path: '/stats' });
});

export default Router;
