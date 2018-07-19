import Component from '@ember/component';
import EmberObject from '@ember/object';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),
  recomputeUserRegions: false,
  userRegions: computed('recomputeUserRegions', function() {
    //alert('gh');
    //this.set('recomputeUserRegions',false);
    let cu = this.get('currentUser.user');
    let groupname = get(cu, 'groups.firstObject.is_admin');
    //let r = get(cu, 'name');
    //let r = cu.groupUsers;
    alert(groupname);
    let newArray = [];
    if (r) {
      r.forEach(function(obj) {
        if (r.group_type=='region') {
          let o = EmberObject.create();
          o.setProperties({groupObject: obj, name: obj.name, proximity: ''});
          newArray.push(o);
        }
      });
    }
    let sortedArray = newArray.sortBy('name');
    return sortedArray;
  }),
  
  init() {
    this._super(...arguments);
  },
  
  _mapZoom: 5,
  mapZoom: computed('sortOption', function() {
    if (this.get('sortOption')=='search') {
      return 2;
    } else {
      return 6;
    }
  }),
  
  _limitList: 0,
  limitList: computed('sortOption', function() {
    if (this.get('sortOption')=='search') {
      return 1000;
    } else {
      return 20;
    }
  }),
  geolocation: service(),
  searchTab: computed('sortOption', function() {
    if (this.get('sortOption')=='search') {
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
    if (this.get('sortOption')!='search') {
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
  regions: alias('model'),
  _processing: false,
  processing: computed('_processing', function() {
    return this.get('_processing');
  }),
  sortOption: 'search',
  sortBySearch: computed('sortOption',function() {
    return this.get('sortOption')=='search'
  }),
  
  sortedRegions: computed('regions','searchString','sortOption','user_longitude','user_latitude', function() {
    let r = this.get('regions');
    let s = this.get('sortOption');
    let m = this.get('searchString').toLowerCase();
    let newArray = [];
    if (s == 'search') {
      r.forEach(function(obj) {
        if ((m == '')||(obj.name.toLowerCase().indexOf(m) != -1)) {
          let o = EmberObject.create();
          o.setProperties({groupObject: obj, name: obj.name, proximity: ''});
          newArray.push(o);
        }
      });
      return newArray.sortBy('name');
    } else if (s == 'proximity') {
      let ulong = this.get('user_longitude');
      let ulat = this.get('user_latitude');
      r.forEach(function(obj) {
        let o = EmberObject.create();
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a = 0.5 - c((ulat - obj.latitude) * p)/2 + c(obj.latitude * p) * c(ulat * p) * (1 - c((ulong - obj.longitude) * p))/2;
        var d = Math.round(7917.5 * Math.asin(Math.sqrt(a)));
        o.setProperties({groupObject: obj, name: obj.name, proximity: d});
        newArray.push(o);
      });
      var sortedArray = newArray.sortBy('proximity');
      
      return sortedArray;
    }
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
      this.set('sortOption', 'search');
    },
    searchStringChange: function() {
      debounce(this, this.updateSearch, 1000, false);
    },
    setRecomputeUserRegions: function() {
      this.set('recomputeUserRegions', true);
    }
  }
  
});
