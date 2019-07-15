import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let group = this.modelFor('authenticated.regions.show');
    return group.loadGroups('event');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('group', this.modelFor('authenticated.regions.show'));
  },
});

//import Route from '@ember/routing/route';

//export default Route.extend({
  //model() {
    //let group = this.modelFor('authenticated.regions.show');
    //return group.loadGroups();
    
    //return this.modelFor('authenticated.regions.show.events');
  //},
  //setupController(controller, model) {
    //this._super(controller, model);
    //controller.set('group', this.modelFor('authenticated.regions.show'));
  //},
//});
