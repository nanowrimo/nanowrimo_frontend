import Route from '@ember/routing/route';

export default Route.extend({
  params:null,
  
  model(params){
    this.set('params', params);
  },
  
  setupController: function(controller, model) {
    controller.set('token', this.get('params.token'));
    this._super(controller, model);
  }
});
