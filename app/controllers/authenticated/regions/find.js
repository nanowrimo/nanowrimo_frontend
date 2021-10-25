import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['ps'],
  regions: null,
  
  init() {
    this._super(...arguments);
    
    //load the regions
    this.get('store').query('group', {
      filter: {
        group_type: 'region'
      },
    }).then(data=>{
      this.set('regions',data);
    });
  },
});
