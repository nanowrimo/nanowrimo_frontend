import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    console.log(params);
    return 'hello world';
  }
});
