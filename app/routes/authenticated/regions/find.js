import Route from '@ember/routing/route';
//import { inject as service } from '@ember/service';

export default Route.extend({
  //geolocation: service(),
  //beforeModel() {
    //return this._getUserLocation();
  //},
  
  model() {
    //return this.get('store').findRecords('region');
    //return this.store.findRecords('regions')
    return this.get('store').query('region', {
      filter: {
        groupType: 'region'
      }
    })
  },
  actions: {
    
  }
});
