import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findRecords('regions')
    /*return this.get('store').query('group', {
      url: 'regions',
      filter: {
        groupType: 'region'
      }
    })*/
  }
});
