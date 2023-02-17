import NanoSubcard from 'nanowrimo/components/nano-subcard';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import moment from 'moment';
import ENV from 'nanowrimo/config/environment';

export default NanoSubcard.extend({
  
  pepTalk: null,
  classNames: ['nw-card'],
  classNameBindings: ['flexSize'],
  copied: false,
  copyClass: null,
  latestPepTalk: null,

  init() {
    this._super(...arguments);
    //start getting data
    this.getLatestPepTalk(this);
  },

  getLatestPepTalk() {
    let endpoint =  `${ENV.APP.API_HOST}/pep_talks/latest`;
    fetch(endpoint).then((data)=>{
      data.json().then((json)=>{
        this.set('latestPepTalk', json.data.attributes);
      });
    });
  },

  pepTalkLoaded: computed('latestPepTalk', function() {
    let o = this.get('latestPepTalk');
    if (o) {
      return true;
    } else {
      return false;
    }
  }),

  // Returns the publication date as a readable string
  computeShowAfter: computed('latestPepTalk', function() {
    return moment(this.get('latestPepTalk.show-after')).format("MMMM D, YYYY");
  }),
  
  imgSrc: computed('latestPepTalk.promotional-card-image', function() {
    return new htmlSafe( this.get('latestPepTalk.promotional-card-image') );
  }),
  
  actions: {
    getRandomPepTalk() {
      let endpoint =  `${ENV.APP.API_HOST}/pep_talks/random`;
      fetch(endpoint).then((data)=>{
        data.json().then((json)=>{
          this.set('latestPepTalk', json.data.attributes);
        });
      });
    },
  }
  
});