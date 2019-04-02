import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { next }  from '@ember/runloop';
import $ from 'jquery';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),
  newProfile: null,
  newProjects: null,
  newBuddies: null,
  profile: null,
  projects: null,
  buddies: null,
  displayForm: true,
  
  /* numbers used here */
  //
  // Profile: 0=private (buddies only), 1=public
  // Projects: 0=only author, 1=buddies, 2=anyone
  // Buddies: 0=only author, 1=buddies, 2=anyone
  
  /* because HTML sends form values as strings, store values as strings */
  
  
  init(){
    this._super(...arguments);
    this._setup();

  },
  
  submitDisabled: computed("newProfile", "newProjects", "newBuddies",
    "profile",
    "projects",
    "buddies", function(){
    //get the values
    let x1=this.get('newProfile');
    let x2=this.get('profile');
    let y1=this.get('newProjects');
    let y2=this.get('projects');
    let z1=this.get('newBuddies');
    let z2=this.get('buddies');
    return (x1==x2 && y1==y2 && z1==z2);
  
  }),
  
  actions:{
    clickedProfile(val){
      this.set('newProfile', val);
      this._profileChange(val);
    },
    clickedProjects(val){
      this.set('newProjects', val);
    },
    clickedBuddies(val){
      this.set('newBuddies', val);
    },
    submitForm(){
      // update the 3 user vars
      let u = this.get('currentUser.user');
      u.set('privacyViewProfile', this.get('newProfile'));
      u.set('privacyViewProjects',this.get('newProjects'));
      u.set('privacyViewBuddies',this.get('newBuddies'));
      u.save().then(()=>{ this._setup(); });
    },
    resetForm(){
      //don't show the form
      this.set('displayForm', false);
      //show the form
      next(()=>{  this.set('displayForm', true) });
      this._setup();
    }
  },
  
  _setup() {
    //get the settings from the user
    let u = this.get('currentUser.user');
    this.set('profile', u.privacyViewProfile.toString());
    this.set('projects', u.privacyViewProjects.toString());
    this.set('buddies', u.privacyViewBuddies.toString());
    this.set('newProfile', u.privacyViewProfile.toString());
    this.set('newProjects', u.privacyViewProjects.toString());
    this.set('newBuddies', u.privacyViewBuddies.toString());
    
    //auto check some stuff 
    this.set(`privacyViewProfile${u.privacyViewProfile}Checked`, true);
    this.set(`privacyViewProjects${u.privacyViewProjects}Checked`, true);
    this.set(`privacyViewBuddies${u.privacyViewBuddies}Checked`, true);
    
    //disable what needs disabling 
    this._profileChange(u.privacyViewProfile.toString())
  },
  
  _profileChange(val) {
    if (val==="1") {
      //enable the appropriate radios
      this.set('privacyViewProjects2Disabled', false);
      this.set('privacyViewBuddies2Disabled', false);
    } else {
       // is the projectsview set to 2? because that is no longer allowed!
      if (this.get('newProjects')=="2") {
        $("#privacyViewProjects1").trigger('click');
      }
      // what about viewing buddies?
       if (this.get('newBuddies')=="2") {
        $("#privacyViewBuddies1").trigger('click');
      }
        
      //this is private, disable some radios
      this.set('privacyViewProjects2Disabled', true);
      this.set('privacyViewBuddies2Disabled', true);
    }
  }

});
