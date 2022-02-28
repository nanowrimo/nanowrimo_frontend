import Component from '@ember/component';
import { computed }  from '@ember/object';
export default Component.extend({
  type: null,
  
  text: computed("type", function(){
    let type = this.get("type");
    switch(type){
      case "NowWhat": 
        return "So you wrote a novel... now what? During the \"Now What\"? Months, set a goal to revise the first 50 pages of your novel three times by the end of February.";
      case "Camp":
        return "Camp NaNoWriMo starts in April! Join the official challenge and set your own writing goal for the month. Achieve your goal and get special badges, a certificate, and more celebration goodies.";
    }
  }),
  
  imageSource: computed("type", function(){
    let type = this.get("type");
    switch(type){
      case "NowWhat": 
        return "/images/global/now-what-pen.svg";
      case "Camp":
        return "/images/banners/camp.png";

    }
  }),
  buttonText: computed("type", function(){
    let type = this.get("type");
    switch(type){
      case "NowWhat": 
        return  "Join the revision challenge";
      case "Camp":
        return "Join Camp NaNoWriMo";

    }
  }),
 
  actions: {
   buttonClicked(){
     let action = this.get('buttonAction');
     if (action){
       action();
     }
   } 
    
  }
});
