import Component from '@ember/component';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  store: service(),
  regions: alias('model'),
  
  init() {
    this._super(...arguments);
  },
  
  _mapZoom: 3,
  mapZoom: computed('sortOption', function() {
    if (this.get('sortOption')=='name') {
      return 4;
    } else {
      return 6;
    }
  }),
  
  _limitList: 0,
  limitList: computed('sortOption', function() {
    if (this.get('sortOption')=='name') {
      return 1000;
    } else {
      return 10;
    }
  }),
  geolocation: service(),
  searchTab: computed('sortOption', function() {
    if (this.get('sortOption')=='name') {
      return 'tabSelected';
    }
    return '';
  }),
  proximityTab: computed('sortOption', function() {
    if (this.get('sortOption')=='proximity') {
      return 'tabSelected';
    }
    return '';
  }),
  searchHide: computed('sortOption', function() {
    if (this.get('sortOption')!='name') {
      return 'nano-show';
    } else {
      return 'nano-hide';
    }
  }),
  proximityHide: computed('sortOption', function() {
    if (this.get('sortOption')=='proximity') {
      return 'nano-hide';
    }
  }),
  processingShow: computed('_processing', function() {
    if (this.get('_processing')==false) {
      return 'nano-hide';
    }
  }),
  processingHide: computed('_processing', function() {
    if (this.get('_processing')) {
      return 'nano-hide';
    }
  }),
  geoObject: null,
  userLocation: null,
  searchString: '',
  tempSearchString: '',
  _processing: false,
  processing: computed('_processing', function() {
    return this.get('_processing');
  }),
  sortOption: 'name',
  sortBySearch: computed('sortOption',function() {
    return this.get('sortOption')=='name'
  }),
  
  userRegions: computed('currentUser.user.regions', function() {
    //var date = new Date();
    //var timestamp = date.getTime();
    
    let r = this.get('currentUser.user.regions');
    let newArray = [];
    if (r) {
      r.forEach(function(obj) {
        let o = EmberObject.create();
        o.setProperties({groupObject: obj, id: obj.id, name: obj.name, proximity: ''});
        newArray.push(o);
      });
    }
    var sorted = this.mergeSort(newArray);
    //var date2 = new Date();
    //var timestamp2 = date2.getTime();
    //console.log("userRegions: " + (timestamp2-timestamp));
    return sorted;
    
    //let sortedArray = newArray.sortBy('name');
    //return sortedArray;
  }),
  
  joinedRegionIds: computed('userRegions', function() {
    let r = this.get('userRegions');
    let newArray = [];
    if (r) {
      r.forEach(function(obj) {
        newArray.push(obj.id);
      });
    }
    return newArray;
  }),
  
  userHasNoRegions: computed('joinedRegionIds', function() {
    if (this.get('joinedRegionIds').length==0) {
      return '';
    } else {
      return 'nano-hide';
    }
  }),
  
  
  mergeSort(a, sortOption) {
    var len = a.length;
    if(len < 2) { 
      return a;
    }
    var pivot = Math.ceil(len/2);
    return this.merge(this.mergeSort(a.slice(0,pivot), sortOption), this.mergeSort(a.slice(pivot), sortOption), sortOption);
  },

  merge(left, right, sortOption) {
    var result = [];
    if (sortOption=='name') {
      while((left.length > 0) && (right.length > 0)) {
        if((left[0]).name < (right[0]).name) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
    }
    if (sortOption=='proximity') {
      while((left.length > 0) && (right.length > 0)) {
        if((left[0]).proximity < (right[0]).proximity) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
    }
    result = result.concat(left, right);
    return result;
  },

  sortedRegions: computed('joinedRegionIds','regions','searchString','sortOption','user_longitude','user_latitude', function() {
    //var date = new Date();
    //var timestamp = date.getTime();
    let r = this.get('regions');
    let joinedRegionIds = this.get('joinedRegionIds');
    let s = this.get('sortOption');
    let m = this.get('searchString').toLowerCase();
    let newArray = [];
    if (s == 'name') {
      r.forEach(function(obj) {
        if (((m == '')||(obj.name.toLowerCase().indexOf(m) != -1))) {
          let o = EmberObject.create();
          o.setProperties({groupObject: obj, id: obj.id, name: obj.name, proximity: ''});
          newArray.push(o);
        }
      });
    } else if (s == 'proximity') {
      let ulong = this.get('user_longitude');
      let ulat = this.get('user_latitude');
      r.forEach(function(obj) {
        let o = EmberObject.create();
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a = 0.5 - c((ulat - obj.latitude) * p)/2 + c(obj.latitude * p) * c(ulat * p) * (1 - c((ulong - obj.longitude) * p))/2;
        var d = Math.round(7917.5 * Math.asin(Math.sqrt(a)));
        o.setProperties({groupObject: obj, id: obj.id, name: obj.name, proximity: d});
        newArray.push(o);
      });
    }
    //console.log("Array length: " + newArray.length);
    for (var i=newArray.length-1; i>=0; i--) {
      if (joinedRegionIds.indexOf(newArray[i].id)>=0) {
        newArray.splice(i, 1);
      }
    }
    var sorted = this.mergeSort(newArray, s);
    //var sorted = newArray.sortBy(s);
    //var date2 = new Date();
    //var timestamp2 = date2.getTime();
    //console.log("sortedRegions: " + (timestamp2-timestamp));
    return sorted;
  }),
  
  _user_longitude: null,
  user_longitude: computed('_user_longitude', '_longitude',function() {
    if (this.get('_user_longitude') == null) {
      return this.get('_longitude');
    } else {
      return this.get('_user_longitude');
    }
  }),
  _user_latitude: null,
  user_latitude: computed('_user_latitude', '_latitude',function() {
    if (this.get('_user_latitude') == null) {
      return this.get('_latitude');
    } else {
      return this.get('_user_latitude');
    }
  }),
  _longitude: -122.42,
  longitude: computed('_longitude',function() {
    return this.get('_longitude');
  }),
  _latitude: 37.77,
  latitude: computed('_latitude',function() {
    return this.get('_latitude');
  }),
  center_longitude: computed('sortOption','_user_longitude', '_longitude',function() {
    if (this.get('_user_longitude') == null) {
      return this.get('_longitude');
    } else {
      return this.get('_user_longitude');
    }
  }),
  center_latitude: computed('sortOption','_user_latitude', '_latitude',function() {
    if (this.get('_user_latitude') == null) {
      return this.get('_latitude');
    } else {
      return this.get('_user_latitude');
    }
  }),
  
  getLoc() {
    this.set('sortOption', 'proximity');
    this.get('geolocation').getLocation().then((geoObject)=>{
      this.set('user_longitude',geoObject.coords.longitude);
      this.set('user_latitude',geoObject.coords.latitude);
      this.set('_processing', false);
      
    });
  },
  updateSearch() {
    this.set('searchString',this.get('tempSearchString'));
  },
  
  actions: {
    remapCenter: function(longitude, latitude) {
      this.set('_longitude', longitude);
      this.set('_latitude', latitude);
    },
    getUserLocation: function() {
      this.set('_processing', true);
      this.getLoc();
    },
    findByString: function() {
      this.set('sortOption', 'name');
    },
    searchStringChange: function() {
      debounce(this, this.updateSearch, 1000, false);
    }
  }
  
});
