import Component from '@ember/component';
import { computed } from '@ember/object';
import { debounce } from '@ember/runloop';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';

export default Component.extend({
  
  offer: null,
  classNames: ['nw-card'],
  classNameBindings: ['flexSize'],
  copied: false,
  copyClass: null,
  
  init() {
    this._super(...arguments);
    //start getting data
    this.getOfferData(this);
  },
  
  getOfferData: function(_this){
    let endpoint = `${ENV.APP.API_HOST}/random_offer`;
    return fetch(endpoint).then((response)=>{
      return response.json().then((json)=>{
         _this.set('offer',json.data.attributes);
      });
    });
  },
  
  offerLoaded: computed('offer', function() {
    let o = this.get('offer');
    if (o) {
      return true;
    } else {
      return false;
    }
  }),
  
  // Returns the class which determines the size of the card
  flexSize: computed('offer',function() {
    let o = this.get('offer');
    if (o) {
      return o.className;
    } else {
      return null;
    }
  }),
  
  // Returns true if the offer has a coupon code
  couponCode: computed('offer',function() {
    if (this.get('offer')) {
      let o = this.get('offer.offer-code');
      return o;
    } else {
      return null;
    }
  }),

  // Returns true if the offer has a coupon code
  hasCouponCode: computed('offer',function() {
    if (this.get('offer')) {
      let o = this.get('offer.offer-code');
      return (o != "");
    } else {
      return null;
    }
  }),

  // Generates the text for the copy box
  copyText: computed('copied',function() {
    let c = this.get('copied');
    let cc = this.get('couponCode');
    if (c) { // If the code has been copied
      return '"' + cc + '" COPIED TO CLIPBOARD';
    } else { // If the code hasn't been copied
      return 'COPY COUPON CODE "' + cc + '"';
    }
  }),
  
  // Resets the copied to false after 5 second debounce
  resetCopied() {
    this.set('copied',false);
    this.set('copyClass', null);
  },
  
  actions: {
    copyCode() {
      // Create a new input field
      var tempInput = document.createElement("input");
      // Put the input field off to the side
      tempInput.style = "position: absolute; left: -1000px; top: -1000px";
      // Give it the value of the coupon code
      tempInput.value = this.get('offer.offer-code');
      // Add the input field to the DOM
      document.body.appendChild(tempInput);
      // Select the code
      tempInput.select();
      // Copy the code to the clipboard
      document.execCommand("copy");
      // Remove the input field from the DOM
      document.body.removeChild(tempInput);
      // Set copied=true, to change the text and background color
      this.set('copied',true);
      // Change the copy box background color
      this.set('copyClass','nw-code-copied');
      // Wait 5 seconds, and then revert everything
      debounce(this, this.resetCopied, 5000, false);
      
    },
  }
  
});
