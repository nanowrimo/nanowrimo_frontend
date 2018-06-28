import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    //return this.get('store').createRecord('flash-banner', {});
    return this.get('store').createRecord('fundometer', { id: 123, goalNumber: 1400000, raisedNumber: 139879, donorNumber: 1456 });
  }
});