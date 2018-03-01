import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  genre: alias('model'),

  actions: {
    deleteGenre() {
      let genre = this.get('genre');
      genre.destroyRecord().then(() => {
        this.get('router').transitionTo('authenticated.genres');
      });
    }
  }
});
