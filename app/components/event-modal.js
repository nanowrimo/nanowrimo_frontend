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
  event: reads('group'),
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
  eventTypeInPerson: true,
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
  _inclusiveChecklistShow: false,
  recomputeLocations: 0,
  
  
  // access features for group
  accessMobility: false,
  accessLgbt: false,
  accessSize: false,
  accessAge: false, 
  accessPathogen: false,
  accessPrice: false,
  accessCaptioning: false,
  venueDetails: null,
  timezoneResponse: null,
  isEditing: false,
  stopGapLocationFix: false,
  timeZoneOptions: computed(function() {
    return TimeZones;
  }),
  showPlaceHolder: false,
  inclusiveChecklistShow: computed('_inclusiveChecklistShow', function() {
    let p = this.get('_inclusiveChecklistShow');
    if (p) {
      return "info-visible";
    } else {
      return "info-hidden";
    }
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
    if (id == "-1") {
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
    // we are using the stop gap location fix :(
    this.set('stopGapLocationFix', false);
    let now = moment();
    let g = this.get('group');
    if (g) {
      this.set('name', g.get('name'));
      //this.set('startDate', g.get('startDt').format("YYYY-MM-DD"));
      this.set('durationHours', parseInt(g.get('durationHours')));
      this.set('timeZone',g.get('timeZone'));
    } else {
      this.set('startDate', now.format("YYYY-MM-DD"));
      this.set('startTime', "19:00");
      this.set('durationHours', 2);
      this.set('timeZone',this.get('currentUser.user.timeZone'));
    }
    this.setProperties({ googleAuto: null });
  },

  // Set local variables based on response from Google Maps Timezone API
  timezoneRetrieved: computed('timezoneResponse', function() {
    let l = this.get('timezoneResponse');
    if (l) {
      this.saveTimezoneData(l);
    }
    return true;
  }),

  saveTimezoneData(response) {
    let r = JSON.parse(response);
    this.set('dstOffset',r.dstOffset);
    this.set('rawOffset',r.rawOffset);
    this.set('timeZoneId',r.timeZoneId);
    this.set('timeZoneName',r.timeZoneName);
    this.saveData();
  },

  transferFailed () {
    alert("Something went wrong. Please try again");
  },

  getTimeZone() {
    let lid = this.get('locationId');
    let datestr = this.get('datestr');
    let timestamp = moment(datestr).unix();
    let t = this;
    let url = 'https://maps.googleapis.com/maps/api/timezone/json?location=';
    // If new location
    if (lid=="-1") {
      url += this.get('latitude') + ',' + this.get('longitude');
    } else {
      let l = this.get('store').peekRecord('location',lid);
      url += l.latitude + ',' + l.longtitude;
    }
    url += '&timestamp=' + timestamp + '&key=AIzaSyDtu-8_FBOLBM4a0kOIPv1p163uHfZ8YG4';
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){
      t.set('timezoneResponse', this.responseText);
    });
    //oReq.addEventListener("load", this.timezoneRetrieved);
    oReq.addEventListener("error", this.transferFailed);
    oReq.open("GET", url);
    oReq.send();
  },
      
  // Creates the group record in the store
  defineGroup() {
    let g;
    if (this.isEditing) {
      let id = this.get('event.id');
      g = this.get('store').peekRecord('group', id);
    } else {
      g = this.get('store').createRecord('group');
    }
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
    //access
    g.set("accessMobility",this.get("accessMobility"));
    g.set("accessLgbt",this.get("accessLgbt"));
    g.set("accessSize",this.get("accessSize"));
    g.set("accessAge", this.get("accessAge"));
    g.set("accessPathogen",this.get("accessPathogen"));
    g.set("accessPrice", this.get("accessPrice" ));
    g.set("accessCaptioning", this.get("accessCaptioning"));
    g.set("venueDetails", this.get("venueDetails"));
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
    let isEditing = this.get('isEditing');
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
            if (isEditing) {
              this.set('open', false);
            }
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
                // Save the user as admin unless editing
                if (!isEditing ) {
                  let gu = this.defineAdminMembership(g);
                  gu.save().then(()=>{
                    // Increment recompute location
                    let rl = this.get('recomputeLocations');
                    this.set('recomputeLocations',rl+1);
                    // Last step
                    this.set('step',2);
                  });
                }
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
         if (isEditing) {
            this.set('open', false);
          }
          let lg = this.get('store').createRecord('location-group');
          lg.set("location_id",lid);
          lg.set("group_id",g.id);
          lg.set("primary",1);
          lg.save().then(()=>{
            if (!isEditing) {
              // Save the user as admin
              let gu = this.defineAdminMembership(g);
              gu.save().then(()=>{
                // Last step
                this.set('step',2);
              });
            }
          });
        });
      }
    } else {
      let g = this.defineGroup();
      g.save().then(()=>{
        if (isEditing) {
          this.set('open', false);
        } else {
          // Save the user as admin
          let gu = this.defineAdminMembership(g);
          gu.save().then(()=>{
            this.set('step',2);
          });
        }
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
  
  buttonText: computed('step', 'isEditing', function(){
    let step = this.get('step');
    let isEditing = this.get('isEditing');
    let text = '';
    switch(step) {
      case 0: 
        text = "Next: Venue";
        break;
      case 1: 
        text = (isEditing) ? "Submit" : "Submit Event for Approval";
        break;
      case 2: 
        text = "Close";
    }
    return text;
  }),
  
  
  // validateField holds all validation code for each field in the events and locations forms
  validateInput(fieldName) {
    let isValid = true;
    switch (fieldName) {
      case "venueAddress":
        var venueAddress = this.get('venueAddress').trim();
        if (venueAddress==null || venueAddress.length==0) {
          this.set('venueAddressError', "The event address is required");
          isValid = false;
        } else {
          this.set('venueAddressError', null);
        }
        break;
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
  
  // set the component properties based on the event's data
  _setEditValues() {
    let event = this.get('event');
    // don't set event types
    this.set('eventTypeInPerson', false);
    this.set('eventTypeOnline', false);
    this.set('venueDetails',event.venueDetails);
    let step = this.get('step');
    
    switch (step) {
      case 0:
        this.set('name', event.name);
        this.set('description', event.description);
        // format the start date
        var year = event.startDt.getFullYear();
        var month = this._zeroPad(event.startDt.getMonth()+1);
        var day = this._zeroPad(event.startDt.getDate());
        this.set('startDate', `${year}-${month}-${day}`);
        //format the start time
        var eventStart = moment.tz(event.startDt,event.timeZone);
        var hours = eventStart.hour();
        var minutes = this._zeroPad(event.startDt.getMinutes());
        var startTime = `${hours}:${minutes}`;
        this.set('startTime', startTime);
        
        // get the duration based on the endDt
        var start = moment(event.startDt);
        var end = moment(event.endDt);
        var diff = end.diff(start,"m");
        var durationHours = (diff > 60) ? Math.floor(diff/60) : 0;
        this.set('durationHours', durationHours);
        var durationMinutes = diff - (60*durationHours);
        this.set('durationMinutes', durationMinutes);
        break;
        
    case 1:

      // are there location-groups?
      if(this.get("hasLocations") ) {
        // what is the locationID of this location?
        let store = this.get('store');
        let locations = store.peekAll('location');
        let locId = -1;
        locations.forEach((loc)=>{
          if (loc.name == event.locationName) {
            locId = loc.id;
          }
        });
        if (locId > 0) {
          // check the In-person box
          this.set('eventTypeInPerson', true);
          this.set('locationId', locId);
          later(()=> document.getElementById('venueSelect').value = String(locId));
        } 
      }
      // is there an event url?
      var eventURL = this.get('event.url');
      if (eventURL) {
        // check the Online box
        this.set('eventTypeOnline', true);
        //insert the url
        this.set('venueUrl', eventURL);
      } 
      
      // the accessibilty checkboxes
      // this is not the Ember way
      document.getElementById('access-mobility').checked = event.accessMobility;
      document.getElementById('access-lgbt').checked = event.accessLgbt;
      document.getElementById('access-size').checked = event.accessSize;
      document.getElementById('access-age').checked = event.accessAge;
      document.getElementById('access-pathogen').checked = event.accessPathogen;
      document.getElementById('access-price').checked = event.accessPrice;
      document.getElementById('access-captioning').checked = event.accessCaptioning;
      
      // handle the venue details
    }
    
  },
  actions: {
    toggleInclusiveChecklist( ) {
      let show = !this.get('_inclusiveChecklistShow');
      this.set('_inclusiveChecklistShow',show);
    },
    
    // Called on switching from one tab to another, or on pressing submit
    formSubmit() {
      event.preventDefault();
      let formElements = event.target.elements;
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
            // is editing happening?
            if (this.get('isEditing') ) {
              later(() => this._setEditValues() );
            }
          }
          
          break;
        }
        case 1: {
           // record the access values
          this.set("accessMobility", formElements['access-mobility'].checked);
          this.set("accessLgbt", formElements['access-lgbt'].checked);
          this.set("accessSize", formElements['access-size'].checked);
          this.set("accessAge", formElements['access-age'].checked) 
          this.set("accessPathogen", formElements['access-pathogen'].checked);
          this.set("accessPrice", formElements['access-price'].checked);
          this.set("accessCaptioning", formElements['access-captioning'].checked);
           let vd = document.querySelector(".editable.form-control.medium-editor-element").innerHTML;
          this.set('venueDetails', vd);
          
          let et = this.validateInput('eventType');
          let valid = false;
          if (et) {
            if (this.get("eventTypeInPerson")) {
              if (this.get("locationId")==-1) {
                let v = this.validateInput('venueName');
                // is the stopGapLocation fix happening?
                let l;
                if (this.get('stopGapLocationFix') ) {
                  l = this.validateInput('venueAddress');
                }else{
                  l = this.validateInput('location');
                }
                if (v&l) {
                  valid = true;
                  //this.getTimeZone();
                } else {
                  break;
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
      this.set("durationHours",parseInt(v));
      this.validateInput('duration');
    },
    
    // Called when the value of the minutes select changes
    minutesChanged(v) {
      this.set("durationMinutes",parseInt(v));
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
    
    // Called when the value of the locationselect changes
    locationChanged(v) {
      let i = parseInt(v);
      this.set("locationId",i);
      this.validateInput('venueSelect');
      // if the id is -1 reset the venueName
      if (i==-1) {
        this.set('venueName', null);
        this.set('location', null);
        this.set('locationSelected', false);
      }
    },
    
    // Called when the value of the minutes select changes
    descriptionChanged(v) {
      this.set("description",v);
    },
    
    // TODO
    done() {
      let messageElement = document.getElementById('message');
      messageElement.classList.add('fade-in-element');
      later(() => messageElement.classList.remove('fade-in-element'), 2000);
      this.set('message', 'blur blur blur');
    },
    
    venueAddressChanged(event){
      let address = event.target.value;
      this.set("venueAddress", address);
      this.validateInput("venueAddress");
      this.set("formatted_address", address);
      
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
      // if there an id associated with the event, we are editing
      if (this.get('event.id')){
        this.set('isEditing', true);
        this._setEditValues();
      }
      var t = document.getElementById("ember-bootstrap-wormhole");
      t.firstElementChild.setAttribute("aria-modal", "true");
      t.firstElementChild.setAttribute("aria-label", "submit an event");
    },
    
    // Called on hiding the modal... resets all to nul
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
  },
  
  _zeroPad(i) {
    var ret = (i < 10) ? `0${i}` : i;
    return ret;
  }

});
