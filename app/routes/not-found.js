import Route from '@ember/routing/route';

export default Route.extend({
  templateName: '404',
    model(params) {
    console.log(params);
  },
});
