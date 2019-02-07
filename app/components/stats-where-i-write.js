import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import {computed} from '@ember/object';

export default ChartBaseComponent.extend({
  svgPath: computed('whereIWrite', function(){
    let retval = null;
    let where = this.get('whereIWrite');
    if(where) {
      switch (where.toLowerCase()) {
        case 'at home':
          retval = "/images/cards/house.svg";
          break;
        case "at the office":
          retval = '';
          break;
        case 'at the library':
          retval='';
          break;
        case 'at a café':
          retval='';
          break;
        default:
          retval = '';
      }
    } else {
      retval =''; //the empty graphic
    }
      return retval;
  })
  
});
