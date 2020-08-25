import Route from '@ember/routing/route';
import ENV from 'nanowrimo/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  model(params) {
    let group = this.modelFor('authenticated.regions.show');
    let url = `${ENV.APP.API_HOST}/groups/${group.id}/admin_get_members`;
    //get the session auth token so we can add it to the request header
    let { auth_token }  = this.get('session.data.authenticated');
    return fetch(url, {
      headers: { 'Content-Type': 'application/json', 'Authorization': auth_token}
    }).then((resp)=>{
      return resp.json().then((json)=>{
        return { listResults: json }
      });
    });
  }
});
