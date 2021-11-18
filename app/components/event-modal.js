import Component from '@ember/component';
import { computed, observer }  from '@ember/object';
import { reads }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { later } from "@ember/runloop";
import TimeZones from 'nanowrimo/lib/time-zones';

export default Component.extend({
  store: service(),
  currentUser: service(),
  currentUserId: reads('currentUser.user.id'),
  
  changeset: null,
  
  tagName: 'span',
  groupId: null,
  tab: null,
  open: null,
  group: null,
  newlocation: null,
  user: null,
  startDate: null,
  startTime: null,
  step: 0,
  recalculateEvents: 0,
  
  // These values are returned from Google Maps Timezones API
  dstOffset: 0,
  rawOffset: 0,
  timeZoneId: null,
  timeZoneName: null,
  timeZone: null,
  name: null,
  nameError: null,
  description: null,
  durationHours: 2,
  durationMinutes: 0,
  durationErrorMessage: null,
  venueName: null,
  venueUrl: null,
  venueNameError: null,
  venueUrlError: null,
  venueErrorMessage: null,
  eventTypeErrorMessage: null,
  locationSelected: false,
  locationErrorMessage: null,
  locationId: 0,
  eventTypeInPerson: false,
  eventTypeOnline: true,
  
  street1: null,
  street2: null,
  neighborhood: null,
  municipality: null,
  city: null,
  county: null,
  state: null,
  postal_code: null,
  country: null,
  formatted_address: null,
  longitude: null,
  latitude: null,
  utc_offset: null,
  
  recomputeLocations: 0,
  
  timezoneResponse: null,
  
  timeZoneOptions: computed(function() {
    return TimeZones;
  }),
  
  // Gets all the affiliated locationGroups in the store
  locationGroups: computed('groupId','recomputeLocations', function() {
    let lgs = this.get('store').peekAll('location_group');
    let id = this.get('groupId');
    let s = [];
    lgs.forEach((lg) => {
      if ((id==lg.group_id)&&(lg.primary==0)&&(lg.id != null)) {
        s.push(lg);
      }
    });
    return s;
  }),
  
  acceptedLocations: computed('locationGroups.[]','recomputeLocations', function() {
    let store = this.get('store');
    let lgs = this.get('locationGroups');
    let ls = [];
    lgs.forEach((lg) => {
      let l = store.peekRecord('location', lg.location_id);
      if (l) {
        ls.push(l);
      }
    });
    return ls;
  }),
  
  hasLocations: computed('acceptedLocations.[]',function() {
    let h = (this.get('acceptedLocations').length>0);
    return h;
  }),
  
  hasLocationsChanged: observer('hasLocations', function(){
    let h = this.get('hasLocations');
    if (!h) {
      this.set('locationId',-1);
    }
  }),
  
  addingLocation: computed('locationId',function() {
    let id = this.get('locationId');
    if (id == -1) {
      return true;
    } else {
      return false;
    }
  }),
  formCurrentStep: computed("step", function(){ 
    return this.get('step')+1;
  }),
  
  formProgressText: computed("step", function(){
    let step = this.get("step");
    let texts = ["Step 1: Details", "Step 2: Venue", "Step 3: Approval"];
    return texts[step];
  }),
  
  progressStepText: computed("step", function(){
    let step = this.get("step");
    let texts = ["Step 1 of 32: Event details", 
      "Step 2 of 2: Event venue", "Step 3 of 3: Event approval"];
    return texts[step];
  }),
  
  
  init() {
    this._super(...arguments);
    let now = moment();
    let g = this.get('group');
    if (g) {
      //alert('old event');
      this.set('name', g.get('name'));
      //this.set('startDate', g.get('startDt').format("YYYY-MM-DD"));
      this.set('durationHours', g.get('durationHours'));
      this.set('timeZone',g.get('timeZone'));
    } else {
      //alert('new event');
      this.set('startDate', now.format("YYYY-MM-DD"));
      this.set('startTime', "19:00");
      this.set('durationHours', "2");
      this.set('timeZone',this.get('currentUser.user.timeZone'));
    }
    this.setProperties({ googleAuto: null });
  },
  
  // Creates the group record in the store
  defineGroup() {
    let g = this.get('store').createRecord('group');
    let n = this.get('name');
    g.set("name",n);
    g.set("groupType","event");
    let tz = this.get("timeZone");
    if (tz) {
      g.set("timeZone",tz);
    } else {
      g.set("timeZone",this.get('currentUser.user.timeZone'));
    }
    let dstr = this.get('startDate') + ' ' + this.get('startTime') + ':00';
    let startMoment = moment.tz(dstr,tz);
    let endMoment = moment.tz(dstr,tz).add((parseInt(this.get('durationHours'))*60) + parseInt(this.get("durationMinutes")), 'minutes');
    g.set("startDt",startMoment.toDate());
    g.set("endDt",endMoment.toDate());
    g.set("userId",this.get("currentUserId"));
    g.set("groupId",this.get("groupId"));
    g.set("longitude",this.get("longitude"));
    g.set("latitude",this.get("latitude"));
    g.set("description",this.get("description"));
    let online = this.get('eventTypeOnline');
    if (online) {
      g.set("url",this.get("venueUrl"));
    }
    return g;
  },
    
  defineAdminMembership(g) {
    let gu = this.get('store').createRecord('group_user');
    gu.set("group_id",this.get("groupId"));
    gu.set("group",g);
    gu.set("user_id",this.get("currentUserId"));
    gu.set("user",this.get("currentUser.user"));
    gu.set("primary",0);
    gu.set("isAdmin",true);
    gu.set("entryMethod",'create');
    return gu;
  },
  
  // saveData saves the location, group, and location_group to the API
  saveData() {
    let inperson = this.get('eventTypeInPerson');
    // If this event has a physical location
    if (inperson) {
      let lid = this.get('locationId');
      // If new location
      if (lid==-1) {
        let l = this.get('store').createRecord('location');
        let v = this.get('venueName');
        l.set("name",v);
        l.set("userId",this.get("currentUserId"));
        l.set("street1",this.get("street1"));
        l.set("street2",this.get("street2"));
        l.set("neighborhood",this.get("neighborhood"));
        l.set("municipality",this.get("municipality"));
        l.set("city",this.get("city"));
        l.set("county",this.get("county"));
        l.set("state",this.get("state"));
        l.set("postal_code",this.get("postal_code"));
        l.set("country",this.get("country"));
        l.set("formatted_address",this.get("formatted_address"));
        l.set("longitude",this.get("longitude"));
        l.set("latitude",this.get("latitude"));
        l.set("utc_offset",this.get("utc_offset"));      
        l.save().then(()=>{
          let g = this.defineGroup();
          g.save().then(()=>{
            // Create the location-group record for the event
            let lg = this.get('store').createRecord('location-group');
            lg.set("location_id",l.id);
            lg.set("group_id",g.id);
            lg.set("primary",1);
            lg.save().then(()=>{
              // Create the location-group record for the region
              let lg2 = this.get('store').createRecord('location-group');
              lg2.set("location_id",l.id);
              lg2.set("group_id",this.get("groupId"));
              lg2.set("primary",0);
              lg2.save().then(()=>{
                // Save the user as admin
                let gu = this.defineAdminMembership(g);
                gu.save().then(()=>{
                  // Increment recompute location
                  let rl = this.get('recomputeLocations');
                  this.set('recomputeLocations',rl+1);
                  // Last step
                  this.set('step',2);
                });
              });
            });
          });
          //});
        });
      } else { // If existing location
        let l = this.get('store').peekRecord('location',lid);
        this.set("longitude",l.longitude);
        this.set("latitude",l.latitude);
        
        let g = this.defineGroup();
        g.save().then(()=>{
          let lg = this.get('store').createRecord('location-group');
          lg.set("location_id",lid);
          lg.set("group_id",g.id);
          lg.set("primary",1);
          lg.save().then(()=>{
            // Save the user as admin
            let gu = this.defineAdminMembership(g);
            gu.save().then(()=>{
              // Last step
              this.set('step',2);
            });
          });
        });
      }
    } else {
      let g = this.defineGroup();
      g.save().then(()=>{
        // Save the user as admin
        let gu = this.defineAdminMembership(g);
        gu.save().then(()=>{
          this.set('step',2);
        });
      });
    }
  },
  
  showDurationError: computed('durationErrorMessage',function() {
    return this.get('durationErrorMessage')!=null;
  }),
  
  showVenueError: computed('venueErrorMessage',function() {
    return this.get('venueErrorMessage')!=null;
  }),
  
  showLocationError: computed('locationErrorMessage',function() {
    return this.get('locationErrorMessage')!=null;
  }),
  
  showEventTypeError: computed('eventTypeErrorMessage',function() {
    return this.get('eventTypeErrorMessage')!=null;
  }),
  
  // validateField holds all validation code for each field in the events and locations forms
  validateInput(fieldName) {
    let isValid = true;
    switch (fieldName) {
      case 'eventType':
        if (!this.get("eventTypeInPerson")&&!this.get("eventTypeOnline")) {
          this.set("eventTypeErrorMessage","Please select at least one type of venue.");
          isValid = false;
        } else {
          this.set("eventTypeErrorMessage",null);
        }
        break;
      case 'eventName':
        if (!this.get("name")) {
          this.set("nameError","The event name is required");
          isValid = false;
        } else {
          this.set("nameError",null);
        }
        break;
      case 'duration':
        if (this.get("durationHours")+this.get("durationMinutes")==0) {
          this.set("durationErrorMessage","Please choose a duration.");
          isValid = false;
        } else {
          this.set("durationErrorMessage",null);
        }
        break;
      case 'venueSelect':
        if (this.get("locationId")==0) {
          this.set("venueErrorMessage","Please select a venue option");
          isValid = false;
        } else {
          this.set("venueErrorMessage",null);
        }
        break;
      case 'venueName':
        if (!this.get("venueName")) {
          this.set("venueNameError","The venue name is required");
          isValid = false;
        } else {
          this.set("venueNameError",null);
        }
        break;
      case 'venueUrl':
        if (!this.get("venueUrl")) {
          this.set("venueUrlError","The venue url is required");
          isValid = false;
        } else {
          this.set("venueUrlError",null);
        }
        break;
      case 'location':
        if (!this.get("locationSelected")) {
          this.set("locationErrorMessage","Please select a location.");
          isValid = false;
        } else {
          this.set("locationSelected",true);
          this.set("locationErrorMessage",null);
        }
        break;
    }
    return isValid;
  },

  actions: {
    
    // Called on switching from one tab to another, or on pressing submit
    changeStep() {
      let s = this.get("step");
      switch (s) {
        case 0: {
          let e = this.validateInput('eventName');
          let d = this.validateInput('duration');
          // get the inner HTML from the medium editor //TODO: remove unused 'description' code.
          let desc = document.querySelector(".editable.form-control.medium-editor-element").innerHTML;
          this.set('description', desc);
          if (e&&d) {
            this.set("step", 1);
          }
          break;
        }
        case 1: {
          let et = this.validateInput('eventType');
          let valid = false;
          if (et) {
            if (this.get("eventTypeInPerson")) {
              if (this.get("locationId")==-1) {
                let v = this.validateInput('venueName');
                let l = this.validateInput('location');
                if (v&l) {
                  valid = true;
                  //this.getTimeZone();
                }
              } else {
                let vs = this.validateInput('venueSelect');
                if (vs) {
                  valid = true;
                  //this.getTimeZone();
                }
              }
            }
            if (this.get("eventTypeOnline")) {
              valid = false;
              let v = this.validateInput('venueUrl');
              if (v) {
                valid = true;
              }
            }
            if (valid) {
              this.saveData();
            }
          }
          break;
        }
        case 2: {
          this.set('open', null);
          break;
        }
      }
    },
    
    // Called when the event name value changes
    nameValueChanged() {
      this.validateInput('eventName');
    },
    
    // Called when the venue name value changes
    venueNameChanged() {
      this.validateInput('venueName');
    },
    
    // Called when the value of the startDate input changes
    startDateChanged(v) {
      this.set("startDate",v);
    },
    
    // Called when the value of the startTime input changes
    startTimeChanged(v) {
      this.set("startTime",v);
    },
    
    // Called when the value of the timeZone select changes
    timeZoneChanged(v) {
      this.set("timeZone",v);
    },
    
    // Called when the value of the hours select changes
    hoursChanged(v) {
      this.set("durationHours",v);
      this.validateInput('duration');
    },
    
    // Called when the value of the minutes select changes
    minutesChanged(v) {
      this.set("durationMinutes",v);
      this.validateInput('duration');
    },
    
    // Called when the value of the in-person checkbox changes
    eventTypeInPersonChanged(v) {
      this.set("eventTypeInPerson",v);
      this.validateInput('eventType');
    },
    
    // Called when the value of the online checkbox changes
    eventTypeOnlineChanged(v) {
      this.set("eventTypeOnline",v);
      this.validateInput('eventType');
    },
    
    // Called when the value of the minutes select changes
    venueUrlChanged() {
      this.validateInput('venueUrl');
    },
    
    // Called when the value of the minutes select changes
    locationChanged(v) {
      this.set("locationId",v);
      this.validateInput('venueSelect');
    },
    
    // Called when the value of the minutes select changes
    descriptionChanged(v) {
      alert(v);
      this.set("description",v);
    },
    
    // TODO
    done() {
      let messageElement = document.getElementById('message');
      messageElement.classList.add('fade-in-element');
      later(() => messageElement.classList.remove('fade-in-element'), 2000);
      this.set('message', 'blur blur blur');
    },

    // Called when the user selects a place from google maps autocomplete
    placeChanged(place) {
      let p = place;
      let t = this;
      p.address_components.forEach(function(ac) {
        if (ac.types[0]=="street_number") {
          t.set("street1",ac.long_name);
        }
        if (ac.types[0]=="route") {
          t.set("street2",ac.long_name);
        }
        if (ac.types[0]=="neighborhood") {
          t.set("neighborhood",ac.long_name);
        }
        if (ac.types[0]=="sublocality") {
          t.set("municipality",ac.long_name);
        }
        if (ac.types[0]=="locality") {
          t.set("city",ac.long_name);
        }
        if (ac.types[0]=="administrative_area_level_2") {
          t.set("county",ac.long_name);
        }
        if (ac.types[0]=="administrative_area_level_1") {
          t.set("state",ac.long_name);
        }
        if (ac.types[0]=="postal_code") {
          t.set("postal_code",ac.long_name);
        }
        if (ac.types[0]=="country") {
          t.set("country",ac.long_name);
        }
      });
      t.set("formatted_address",p.formatted_address);
      t.set("longitude",p.geometry.location.lng());
      t.set("latitude",p.geometry.location.lat());
      t.set("utc_offset",p.utc_offset);
      t.set("locationSelected",true);
      t.set("locationErrorMessage",null);
    },
    
    setStep(stepNum) {
      this.set("step", stepNum);
    },
    
    onShow() {
      var t = document.getElementById("ember-bootstrap-wormhole");
      t.firstElementChild.setAttribute("aria-modal", "true");
      t.firstElementChild.setAttribute("aria-label", "submit an event");
    },
    
    // Called on hiding the modal
    onHidden() {
      this.set("step", 0);
      this.set("name",null);
      this.set("venueName",null);
      this.set("venueUrl",null);
      this.set("address2",null);
      this.set("durationErrorMessage",null);
      this.set("venueNameError",null);
      this.set("venueUrlError",null);
      this.set("eventTypeErrorMessage",null);
      this.set("locationSelected",false);
      this.set("locationErrorMessage",null);
      this.set("locationId",0);
      this.set("eventTypeInPerson",false);
      this.set("eventTypeOnline",true);
      let callback = this.get('onHidden');
      if (callback) {
        callback();
      } else {
        this.set('open', null);
      }
    },
    
    afterSubmit() {
      //hide the modal
      this.set('open', null);
      let as = this.get('afterSubmit');
      if (as) { as() }
    }
  }
});
