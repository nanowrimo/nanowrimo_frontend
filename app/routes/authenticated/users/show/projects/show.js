import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.get('store').queryRecord('project', { slug: params.project_slug, include: 'genres,challenges'});
  }
});
