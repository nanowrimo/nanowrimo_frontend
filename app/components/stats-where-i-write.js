import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import {computed} from '@ember/object';

export default ChartBaseComponent.extend({
  svgPath: computed('whereIWrite', function(){
    let retval = null;
    switch (this.get('whereIWrite') ) {
      case 'home':
        retval = "/images/cards/house.svg";
    }
    return retval;
  })
  
});
