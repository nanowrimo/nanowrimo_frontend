import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    return this.get('store').query('challenge',{ available: true});
    
  }
});
