import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  authFacebook: false,
  authGoogle: false,
  submitDisabled: null,
  actions: {
    authenticateFacebook() {
      this.set('authFacebook', true);
      this.get('session').authenticate('authenticator:torii', 'facebook-connect', {})
        .then(()=> {
          })
        .catch((error) => {
          this.set('authFacebook', false);
          alert(error);
        });
    },

    authenticateGoogle() {
      this.set('authGoogle', true);
      this.get('session').authenticate('authenticator:torii', 'custom-google', {})
        .then(()=>{
        })
        .catch((error) => {
          this.set('authGoogle', false);
          alert(error);
        });
    }
  }
});
