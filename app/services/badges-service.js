import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  load() {
    return this.get('store').query('badge',{});
  }
  
});