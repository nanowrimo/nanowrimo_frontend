import Component from '@ember/component';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  init() {
    this._super(...arguments);
  },
  
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
          o.setProperties({regionObject: obj, name: obj.name, proximity: ''});
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
        o.setProperties({regionObject: obj, name: obj.name, proximity: d});
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
  _longitude: 45.00,
  longitude: computed('_longitude',function() {
    return this.get('_longitude');
  }),
  _latitude: 45.00,
  latitude: computed('_latitude',function() {
    return this.get('_latitude');
  }),
  getLoc() {
    this.set('sortOption', 'proximity');
    this.get('geolocation').getLocation().then((geoObject)=>{
      this.set('user_longitude',geoObject.coords.longitude);
      this.set('user_latitude',geoObject.coords.latitude);
      this.set('_processing', false);
      
    });
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
    }
  }
  
});
