import EmberRouter from '@ember/routing/router';
import config from './config/environment';

import RouterScroll from 'ember-router-scroll';

const Router = EmberRouter.extend( RouterScroll, {
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
    this.route('settings', function() {
      this.route('account');
      this.route('privacy', function() {
      });
      this.route('preferences', function() {
      });
      this.route('blocked', function() {
      });
      this.route('regions', function() {
      });
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
    this.route('nanomessages', function() {
      this.route('show', { path: '/:slug'}, function() {
      });
    });
    this.route('project',function(){
      this.route('show', { path: '/:project_slug'}, function(){});
    });
    
    // callback for discourse SSO
    this.route('sso');
    
    //dummy route to redirect to the forums
    this.route('forums');
  });

  //email confirmations
  this.route('confirm-email');

  this.route('index', { path: '/' });
  this.route('sign-up');
  this.route('sign-in');
  
  // universal pages
  this.route('what-is-nanowrimo');
  this.route('terms-conditions');
  this.route('ways-to-support');
  this.route('writers-resources');
  this.route('connect');
  this.route('press');
  this.route('about');
  this.route('pep-talks');
  this.route('nano-prep');
  this.route('offers');
  this.route('programming-and-impact');
  
  
  this.route('404');
  this.route('not-found', { path: '/*path' });
  this.route('error');
  this.route('forgot-password');
  this.route('resend-confirmation-email');
  this.route('password-reset');
  this.route('confirm-email-change');
  this.route('revert-email-change');
  this.route('widgets');
});

export default Router;
