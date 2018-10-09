import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let group = this.modelFor('authenticated.nanomessages.show');
    return this.get('store').query('nanomessage', {
      filter: { group_id: group.id },
      include: 'user,group'
    });
  },
  
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('group', this.modelFor('authenticated.nanomessages.show'));
  },

  actions: {
    refreshModel() {
      this.refresh();
    }
  }
});
