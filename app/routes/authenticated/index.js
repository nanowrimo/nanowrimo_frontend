import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    let fundometer = this.get('store').peekRecord('fundometer', 1);
    if (fundometer) {
      return fundometer;
    } else {
      return this.get('store').createRecord('fundometer', { id: 1, goalNumber: 1400000, raisedNumber: 139879, donorNumber: 1456 });
    }
  }
});
