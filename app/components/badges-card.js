//import NanoSubcard from 'nanowrimo/components/nano-subcard';
import Component from '@ember/component';
import { computed }  from '@ember/object';
//import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
export default Component.extend({
  store: service(),
  badgesService: service(),
  cardTitle: null,
  badgeType: null,
  user: null,
  projectChallenge: null,
  parentRecomputeBadges: 0,
  init() {
    this._super(...arguments);
  },
  
  filteredBadges: computed('badges.[]','projectChallenge', function(){
    let filteredBadges = [];
    // get the badges
    let badges = this.get('badges');
    
    // get the type
    let bt = this.get('badgeType');
    if (bt =="word count") {
      //do some filtering based on project challenge
      let pc = this.get('projectChallenge');
      if (!pc) {return}
      let duration = pc.get('duration');
      let goal = pc.get('goal');
      let eventType = pc.get('eventType');
      badges.forEach((badge)=>{
        switch(badge.title) { 
          case "Wrote 50,000 Words During NaNoWriMo":
          if (eventType==0) {filteredBadges.pushObject(badge);} 
          break;  
                 
          case "Achieved Your Camp NaNoWriMo Goal":
          if (eventType==1) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Write 40,000 Words":
          if (goal>=40000) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Write 25,000 Words":
          if (goal>=25000) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Write 10,000 Words":
          if (goal>=10000) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Write 5,000 Words":
          if (goal>=5000) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Write 1,667 Words":
          if (goal>=1667) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Start a Streak":
          if (duration>=2) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Update Word Count 3 Days in a Row":
          if (duration>=3) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Update Word Count 7 Days in a Row":
          if (duration>=7) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Update Word Count 14 Days in a Row":
          if (duration>=14) {filteredBadges.pushObject(badge);} 
          break;    
               
          case "Update Word Count 21 Days in a Row":
          if (duration>=21) {filteredBadges.pushObject(badge);} 
          break; 
             
          case "Achieved Your Goal for Your Writing Project":
          if (eventType==2) {filteredBadges.pushObject(badge);} 
          break;    
          
          case "Reached the Halfway Mark":
          if (eventType==2) {filteredBadges.pushObject(badge);} 
          break;    
          
          case "Achieved Par Every Day":
          if (eventType==2) {filteredBadges.pushObject(badge);} 
          break;    
            
          default:
          filteredBadges.pushObject(badge);
        }
      });
    } else {
      filteredBadges = badges;
    }
    return filteredBadges;
  }),
  

  badges: computed('badgesService.recomputeBadges','badgeType','parentRecomputeBadges','user.userBadges.{[]}', function() {
    let rb = this.get('badgesService.recomputeBadges');
    let newbs = [];
    if (rb>=0) {
      let bt = this.get('badgeType');
      let bs = this.get('store').peekAll('badge');
      bs.forEach(function(badge) {
        if (badge.badge_type==bt) {
          newbs.push(badge);
        }
      });
    }
    return newbs;
  }),
  
  firstBadge: computed('filteredBadges.[]', function() {
    let bs = this.get('filteredBadges');
    return bs[0];
  }),
  
  // Returns the browser width
  browserWidth: computed(function() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }),
  
  honeycombHeight: computed('badges', function() {
    let bs = this.get('badges');
    let bw = this.get('browserWidth');
    let tag = "height: " + (bs.length*45) + "px";
    if (bw > 600) {
      tag = "height: " + (bs.length*20) + "px";
    }
    return tag.htmlSafe();
  }),
});
