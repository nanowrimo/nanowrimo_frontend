import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    return this.get('store').query('notification',{ viewall: true});
    //return this.get('store').findAll('notification');
  }
});
