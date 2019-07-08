import Mixin from '@ember/object/mixin';

export default Mixin.create({
  //override beforeModel 
  beforeModel(transition) {
    //get the value of the default beforeModel 
    let returnValue = this._super(transition);
    //get the ps param from the transition to
    let ps = transition.to.queryParams.ps;
    // are we preserving scroll?
    if (ps==="true") {
      //do nothing! :)
    } else {
      //don't preserve the scroll position, scroll to top
      window.scrollTo(0,0);
    }
    //return the default beforeModel value
    return returnValue;
  }
});
