import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model(params) {
    return this.get('store').queryRecord('group', { slug: params.slug });
  },
});
