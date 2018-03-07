import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.get('store').createRecord('genre');
  },

  renderTemplate(controller, model) {
    let editController = this.controllerFor('authenticated/genres/edit');
    this.render('authenticated/genres/edit', { controller: editController, model });
  }
});
