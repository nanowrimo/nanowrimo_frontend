import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() {
    return this.modelFor('authenticated.users.show');
  }
});
