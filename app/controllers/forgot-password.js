import Controller from '@ember/controller';

export default Controller.extend({
  hasError: false,
  
  actions: {
    submit(form) {
      let email = form.get('email');
      if (this.validEmail(email) ){
        console.log(email);
      } else {
        this.set('hasError', true);
      }
    },
    emailChange: function(val) {
      if (this.get('hasError') ){
        if (this.validEmail(val) ) {
          this.set('hasError', false);
        }
      }
    }
  },
  
  validEmail: function(value) {
    return (value.includes("@") && value.includes("."));
  },
  
  
});
