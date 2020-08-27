import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'nanowrimo/config/environment';
/*
<<<<<<< HEAD
const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  LOG_TRANSITIONS: false,
  LOG_TRANSITIONS_INTERNAL: false,
  Resolver
});
//=======
*/
export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}
//>>>>>>> fba111b... v3.12.0...v3.20.0

loadInitializers(App, config.modulePrefix);
