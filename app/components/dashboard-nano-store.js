import NanoSubcard from 'nanowrimo/components/nano-subcard';
//import fetch from 'fetch'; 
import ENV from 'nanowrimo/config/environment';

export default NanoSubcard.extend({
  items: null,
  item: null,
  
  init() {
    this._super(...arguments);
    this.fetchStoreItems(this);
    //pick a random item ever 15 minutes
    //let milliseconds = 15*60*1000;
    //setInterval(this.setRandomItem, milliseconds, this);
  },
  
  fetchStoreItems: function(_this){
    //get the store items
    let endpoint = `${ENV.APP.API_HOST}/store_items`;
    return fetch(endpoint).then((response)=>{
      return response.json().then((json)=>{
        _this.set('items',json);
        _this.setRandomItem(_this)
      });
    });
  },
  
  setRandomItem: function(_this){
    let items = _this.get('items');
    let item = items[Math.floor(Math.random()*items.length)];
    _this.set('item', item);
  }
  
});
