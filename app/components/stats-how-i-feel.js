import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import {computed} from '@ember/object';

export default ChartBaseComponent.extend({

  feelingString: computed('averageFeeling', function(){
    let strings = ['upset','stressed','just ok', 'pretty good', 'great'];
    return strings[this.get('averageFeeling')-1 ];
  }),
  
  feelingIntroString: computed('averageFeeling', function(){
    let strings = ['Oh no','Uh oh','Hmmm', 'Nice', 'Nice'];
    return strings[this.get('averageFeeling')-1 ];
  }),
  
  feelingImg: computed('averageFeeling', function(){
    return `/images/cards/how-i-feel/smiley${this.get('averageFeeling')}.svg`;
    
  }),
  
  hasAverageFeeling: computed('averageFeeling', function() {
    return (this.get('averageFeeling') > 0);
  })
});
