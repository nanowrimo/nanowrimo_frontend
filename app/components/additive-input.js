import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  inputType: 'text', //default to type text
  inputIdentifier: null, // url, book, author
  maxNumberOfInputs: 5, //default to no more than 5 inputs
  parentArray: '',
  inputAvailable: computed("parentArray.length", "maxNumberOfInputs", function(){
    return this.get('parentArray').length < this.get('maxNumberOfInputs');
  }),
  
  valuesAreUnique: computed("parentArray.length", function(){
    //get a map of the just the values
    let v1 = this.get('parentArray').map((item)=>{return item.value});
    // create a new array from the set of values
    let v2 = Array.from(new Set(v1));
    //compare the length
    return v1.length == v2.length;
  }),
  
  actions: {
    newInput() {
      let input = {value:null};
      let pa = this.get('parentArray');
      pa.insertAt(pa.length, input);
    },
    delInput(index) {
      let pa = this.get('parentArray');
      pa.removeAt(index);
    }
  }
});
