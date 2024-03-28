import Route from '@ember/routing/route';

export default Route.extend({
  model() { // unless model returns a promise, the 'loading' graphic is never hidden
    return new Promise((resolve)=> {resolve();});
  }
});
