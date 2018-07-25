import Route from '@ember/routing/route';

export default Route.extend({
  model(params){
    return {"red":"green"};
  },
  setupController(controller, model) {
    controller.set('model', model);

  }
});
