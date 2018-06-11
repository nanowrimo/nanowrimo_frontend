import { get, computed } from '@ember/object';
import { reads }  from '@ember/object/computed';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),
  currentUser: service(),
  currentUserEmail: reads('currentUser.user.email'),
  sideMenuIsOpen: true,
  homeUrl: "index",
  flashBanners: computed('currentUserEmail', function() {
    let flashBanners = [
      {
        content: "Welcome to NaNoWriMo! We just sent an email to " + get(this,'currentUserEmail') + " with a confirmation link, just so we know you're the right you. Click it and you'll be up and running in just a few moments!",
        image_url: "/images/banners/wavinghand.svg",
        image_style: "image-unframed",
        button_text: "",
        button_link: "",
        dismissable: false
      },
    ];
    return flashBanners;
  })
  
});