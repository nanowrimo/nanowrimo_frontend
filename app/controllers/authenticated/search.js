import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
export default Controller.extend({
  currentUser: service(),
  router: service(),
  searchService: service(),
  
  queryParams: ['q'],
  q: alias('searchService.q'),
  
  //Returns the result string
  resultString: computed('size', function() {
    let m = this.get('model');
    let l = m.searchResults.data.length;
    let s = l.to_s + " users found:";
    switch(l) {
      case 1: {
        s = "One user found:";
        break;
      }
      case 2: {
        s = "Two users found:";
        break;
      }
      case 3: {
        s = "Three users found:";
        break;
      }
      case 4: {
        s = "Four users found:";
        break;
      }
      case 5: {
        s = "Five users found:";
        break;
      }
      case 6: {
        s = "Six users found:";
        break;
      }
      case 7: {
        s = "Seven users found:";
        break;
      }
      case 8: {
        s = "Eight users found:";
        break;
      }
      case 9: {
        s = "Nine users found:";
        break;
      }
      case 10: {
        s = "Ten users found:";
        break;
      }
    }
    return s;
  }),
  

  actions: {
  }
});
