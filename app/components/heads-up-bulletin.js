import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import moment from 'moment';

export default Component.extend({
  currentUser: service(),
  challenge: null,
  updateDelay: 1000,
  secondsLeft: null,
  //newProject: true,
  
  init() {
    this._super(...arguments);
    let a = moment();
    let challenge = this.get("challenge");
    let b = moment(challenge.startsAt);
    let diff = Math.round(b.diff(a)/1000);
    this.set('secondsLeft', diff); 
    this.timer();
  },
  
  timer() {
    if (this.isDestroyed) {
      return;
    }
    let delay = this.get('updateDelay');
    let a = moment();
    let challenge = this.get("challenge");
    let b = moment(challenge.startsAt);
    let diff = Math.round(b.diff(a)/1000);
    this.set('secondsLeft', diff); 
    //let newSeconds = this.get('secondsLeft')-1;
    //this.set('secondsLeft',newSeconds);
    if (diff >= 0) {
      debounce(this, this.timer, delay, false);
    }
  },
  
  daysRemaining: computed("secondsLeft", function() {
    return Math.floor(this.get('secondsLeft')/86400);
  }),
  
  daysRemainingString: computed("daysRemaining", function() {
    let days = this.get("daysRemaining");
    if (days > 1) {
      return days + " days, ";
    } else if (days === 1) {
      return "1 day, ";
    } else {
      return "";
    }
  }),
  
  hoursRemaining: computed("secondsLeft", "daysRemaining", function() {
    let days = this.get("daysRemaining");
    let secondsLeft = this.get("secondsLeft");
    let newSeconds = secondsLeft - (days * 86400);
    return Math.floor(newSeconds/3600);
  }),
  
  hoursRemainingString: computed("daysRemaining", "hoursRemaining", function() {
    let days = this.get("daysRemaining");
    let hours = this.get("hoursRemaining");
    if (hours > 1) {
      return hours + " hours, ";
    } else if (hours === 1) {
      return "1 hour, ";
    } else if (days > 0) {
      return "0 hours, ";
    } else {
      return "";
    }
  }),
  
  minutesRemaining: computed("secondsLeft", "daysRemaining", "hoursRemaining", function() {
    let days = this.get("daysRemaining");
    let hours = this.get("hoursRemaining");
    let secondsLeft = this.get("secondsLeft");
    let newSeconds = secondsLeft - (days * 86400) - (hours * 3600);
    return Math.floor(newSeconds/60);
  }),
  
  minutesRemainingString: computed("daysRemaining", "hoursRemaining", "minutesRemaining", function() {
    let days = this.get("daysRemaining");
    let hours = this.get("hoursRemaining");
    let minutes = this.get("minutesRemaining");
    if (minutes > 1) {
      return minutes + " minutes, ";
    } else if (minutes === 1) {
      return "1 minute, ";
    } else if ((days > 0) || (hours > 0)) {
      return "0 minutes, ";
    } else {
      return "";
    }
  }),
  
  secondsRemaining: computed("secondsLeft", "daysRemaining", "hoursRemaining", "minutesRemaining", function() {
    let days = this.get("daysRemaining");
    let hours = this.get("hoursRemaining");
    let minutes = this.get("minutesRemaining");
    let secondsLeft = this.get("secondsLeft");
    let newSeconds = secondsLeft - (days * 86400) - (hours * 3600) - (minutes * 60);
    return newSeconds;
  }),
  
  secondsRemainingString: computed("daysRemaining", "hoursRemaining", "minutesRemaining", "secondsRemaining", function() {
    let days = this.get("daysRemaining");
    let hours = this.get("hoursRemaining");
    let minutes = this.get("minutesRemaining");
    let seconds = this.get("secondsRemaining");
    if (seconds > 1) {
      if ((days > 0) || (hours > 0) || (minutes > 0)) {
        return "and " + seconds + " seconds";
      } else {
        return seconds + " seconds";
      }
    } else if (seconds === 1) {
      if ((days > 0) || (hours > 0) || (minutes > 0)) {
        return "and 1 second";
      } else {
        return "1 second";
      }
    } else if ((days > 0) || (hours > 0) || (minutes > 0)) {
      return "and 0 seconds";
    } else {
      return "";
    }
  }),
  
  challengeId: computed("challenge", function() {
    let challenge = this.get("challenge");
    return challenge.id;
  }),
  
  typeName: computed("challenge","type", function() {
    let challenge = this.get("challenge");
    if (challenge.eventType === 1) {
      return "Camp NaNoWriMo";
    }
    if (challenge.eventType === 0) {
      return "November";
    }
    // default to returning the type string
    return this.get('type');
  }),
  
  headerText: computed("typeName", "secondsLeft", "daysRemainingString", "hoursRemainingString", "minutesRemainingString", "secondsRemainingString", function(){
    let type = this.get("typeName");
    let secondsLeft = this.get("secondsLeft");
    let daysRemainingString = this.get("daysRemainingString");
    let hoursRemainingString = this.get("hoursRemainingString");
    let minutesRemainingString = this.get("minutesRemainingString");
    let secondsRemainingString = this.get("secondsRemainingString");
    if (secondsLeft > 0) {
      return type + " starts in " + daysRemainingString + hoursRemainingString + minutesRemainingString + secondsRemainingString + "!";
    } else {
      return type + " has begun!"
    }
  }),
  
  text: computed("typeName", "challenge", "secondsLeft", function(){
    let type = this.get("typeName");
    switch(type){
      case "November":
        return "Are you ready to write a novel this November? Join the official NaNoWriMo challenge with a new or existing novel. Either way, you're about to write 50,000 life-changing words.";
      case "NowWhat": 
        return "So you wrote a novel... now what? During the \"Now What\"? Months, set a goal to revise the first 50 pages of your novel three times by the end of February.";
      case "Camp NaNoWriMo":
        return "Join the official challenge and set your own writing goal for the month. Get community support, writing motivation, and celebratory goodies if you meet your goal!";
      case "DonationWeekend":
        return "It's Double-Up Donation Weekend! Give $25 by November 6 to receive the $50 donor goodies—and an exclusive 2022 enamel pin (plus the chance to win daily prizes).";
      case "HowToWin":
        return "December is approaching—you can do it, writer! Learn how to claim your official NaNoWriMo 2022 win.";
    }
  }),
  
  imageSource: computed("typeName", function(){
    let type = this.get("typeName");
    switch(type){
      case "NowWhat": 
        return "/images/global/now-what-pen.svg";
      case "November":
        return "/images/logo/logo.svg";
      case "Camp NaNoWriMo":
        return "/images/banners/camp.png";
      case "DonationWeekend":
        return "/images/banners/flower.png";
      case "HowToWin":
        return "/images/banners/trophy.png";

    }
  }),
  
  /*buttonText: computed("type", function(){
    let type = this.get("type");
    switch(type){
      case "NowWhat": 
        return  "Join the revision challenge";
      case "Camp":
        return "Join Camp NaNoWriMo";

    }
  }),*/
  
  //addSimpleProject: false,
  
 
  actions: {
    /*afterProjectModalClose() {
      this.set('addProject', null);
    },
    openNewProjectModal() {
      this.set('addProject', true);
    },
    openNewSimpleAddProjectModal() {
      this.set('newProject', true);
      this.set('addSimpleProject', true);
    },
    openNewSimpleExtendProjectModal() {
      this.set('newProject', false);
      this.set('addSimpleProject', true);
    },
    afterSimpleProjectModalClose() {
      this.set('addSimpleProject', null);
    },
    afterNewProjectSubmit() {
      this.get('router').transitionTo('authenticated.users.show.projects', this.get('currentUser.user.slug'));
    },

    buttonClicked(){
      let action = this.get('buttonAction');
      if (action){
        action();
      }
    } */
    
  }
});
