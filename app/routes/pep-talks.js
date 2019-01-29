import Route from '@ember/routing/route';

export default Route.extend({
  redirect: function() {
    window.location.replace("https://nanowrimo.org/pep-talks");
  }
});
