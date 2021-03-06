import EmberRouter from '@ember/routing/router';
//import GoogleAnalyticsRoute from 'ember-tracker/mixins/google-analytics-route';
import config from 'nanowrimo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('authenticated', { path: '' }, function() {
    this.route('dashboard');
    this.route('search');
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
        this.route('groups', function() {
        });
      });
      this.route('edit');
    });
    this.route('settings', function() {
      this.route('account');
      this.route('delete-account');
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
    this.route('groups', function() {
    });
    this.route('notifications', function() {
    });
    this.route('locations', function() {
    });
    this.route('regions', function() {
      this.route('find');
      this.route('leaderboard');
      this.route('show', { path: '/:slug'}, function() {
        this.route('events', function() {
          this.route('upcoming');
          this.route('past');
          this.route('pending');
          this.route('show', { path: '/:event_slug' });
        });
        this.route('admin', function() {
          this.route('members');
          this.route('writing', function() {
            this.route('show', { path: '/:challenge_id' });
          }),
          this.route('locations');
        });
      });
    });
    this.route('writing-groups', function() {
      this.route('show', { path: '/:slug'}, function() {
        this.route('admin');
      });
    });
    this.route('nanomessages', function() {
      this.route('show', { path: '/:slug'}, function() {
      });
    });
    //this.route('project',function(){
      //this.route('show', { path: '/:project_slug'}, function(){});
    //});
    
    // callback for discourse SSO
    this.route('sso');
    
    //dummy route to redirect to the forums
    this.route('forums');
    
    /* TODO: refactor to a generic winner route */
    //temporary route to camp-nanowrimo-april-2020-winner 
    this.route('camp-nanowrimo-july-2020-winner');
    this.route('camp-nanowrimo-april-2020-winner');
    this.route('camp-nanowrimo-april-2021-winner');
    this.route('camp-nanowrimo-july-2021-winner');
    this.route('nano-winner-2019');
    this.route('nano-winner-2020');
    this.route('year-in-review', function() {
      this.route('show', { path: '/:year'}, function() {
      });
    });
    
  });

  //email confirmations
  this.route('confirm-email');
  // unsubscribe 
  this.route('unsubscribe', {path: '/unsubscribe/:token'});

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
  //this.route('about');
  //this.route('test');
  //this.route('pep-talks');
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

  //delete request
  this.route('delete-request', {path: '/delete-request/:token'});
  
});

