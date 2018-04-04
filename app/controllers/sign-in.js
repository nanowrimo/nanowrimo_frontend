import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  error: null,

  signInAttempt: alias('model'),

  actions: {
    authenticateFacebook() {
      this.get('session').authenticate('authenticator:torii', 'facebook-connect', {})
        .then(()=> {
          //invalidate the torii session
          
          })
        .catch((error) => {
          alert(error);
        });
    },

    authenticateGoogle() {
      this.get('session').authenticate('authenticator:torii', 'custom-google', {})
        .then(()=>{
          //invalidate the session
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
});
