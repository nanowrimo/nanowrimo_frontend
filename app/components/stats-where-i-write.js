import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import {computed} from '@ember/object';
import { inject as service} from '@ember/service';

export default ChartBaseComponent.extend({
  store: service(),
  
  writingLocation: computed('projectChallenge.writingLocation', function(){
    return this.get('projectChallenge.writingLocation');
  }),
  
  svgPath: computed('writingLocation', function(){
    let retval = null;
    let where = this.get('writingLocation');
    if(where) {
      switch (where.toLowerCase()) {
        case 'at home':
          retval = "/images/cards/where-i-write/house.svg";
          break;
        case "at the office":
          retval = '/images/cards/where-i-write/office.svg';
          break;
        case 'at the library':
          retval='/images/cards/where-i-write/library.svg';
          break;
        case 'at a café':
          retval='/images/cards/where-i-write/cafe.svg';
          break;
        default:
          retval = '/images/cards/where-i-write/default.svg';
      }
    } else {
      retval ='/images/cards/where-i-write/no-data.svg'; //the empty graphic
    }
      return retval;
  })
  
});
