import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import {computed} from '@ember/object';

export default ChartBaseComponent.extend({

  feelingString: computed('averageFeeling', function(){
    let strings = ['upset','stressed','just ok', 'pretty good', 'great'];
    return strings[this._feeling()-1 ];
  }),
  
  feelingIntroString: computed('averageFeeling', function(){
    let strings = ['Oh no','Uh oh','Hmmm', 'Nice', 'Nice'];
    return strings[this._feeling()-1 ];
  }),
  
  feelingImg: computed('averageFeeling', function(){
    return `/images/cards/smiley${this._feeling()}.svg`;
    
  }),
  
  _feeling: function(){
    return parseInt(this.get('averageFeeling'));
  }
});
