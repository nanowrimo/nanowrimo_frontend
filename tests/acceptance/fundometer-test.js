import { module, test } from 'qunit';
import { currentURL, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
//import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | route not found', function(hooks) {
  setupApplicationTest(hooks);

  module('Authenticated', function(hooks) {
    test("I can view the fundometer", function() {
      var fundometer = server.create('fundometer');
      visit('/');
    });
  });
});
