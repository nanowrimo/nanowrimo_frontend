import { startMirage } from 'nanowrimo/initializers/ember-cli-mirage';

export default function(hooks) {
  hooks.beforeEach(function() {
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });
}
