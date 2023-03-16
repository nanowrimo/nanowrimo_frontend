import Component from '@ember/component';

export default Component.extend({
  
  didRender(){
    this._super(...arguments);
    console.log('did render');
    mobiscroll.setOptions({
      theme: 'windows',
      themeVariant: 'light'
    });
    // do the things
     mobiscroll.datepicker('.nano-datepicker', {
      controls: ['date'],
    }); 
    mobiscroll.datepicker('.nano-timepicker', {
      controls: ['time'],
    }); 
    mobiscroll.datepicker('.nano-calpicker', {
      controls: ['calendar'],
    }); 
    mobiscroll.datepicker('.nano-calmultipicker', {
      controls: ['calendar'],
      selectMultiple: true,
    }); 
  }
 
});
