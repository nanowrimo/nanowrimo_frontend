import Component from '@ember/component';
import { computed } from '@ember/object';
import { debounce } from '@ember/runloop';

export default Component.extend({
  
  offer: null,
  classNames: ['nw-card'],
  classNameBindings: ['flexSize'],
  copied: false,
  copyClass: null,

  // Returns the class which determines the size of the card
  flexSize: computed('offer',function() {
    let o = this.get('offer');
    return o.className;
  }),
  
  // Returns true if the offer has a coupon code
  couponCode: computed('offer',function() {
    let o = this.get('offer.offer-code');
    return o;
  }),

  // Returns true if the offer has a coupon code
  hasCouponCode: computed('offer',function() {
    let o = this.get('offer.offer-code');
    return (o != "");
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
