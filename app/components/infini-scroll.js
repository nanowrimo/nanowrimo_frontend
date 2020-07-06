import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    let _this = this;
    this.element.onscroll = function() {
      let st = _this.element.scrollTop;
      let sh = _this.element.scrollHeight;
      let ch = _this.element.clientHeight;

      if (st+ch >= sh) {
        // scrolledTobottom() is a reference to an action passed in via the template
        _this.scrolledToBottom();
      }
    };
  }
  
  
});
