import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    //return this.get('store').query('group', {
    //  filter: {
    //    group_type: 'region'
    //  }
    //})
    return this.get('store').query('group', {
      filter: {
        group_type: 'region'
      },
      //include: 'location-groups,locations'
    });
  }
});
