import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  content: "Welcome to NaNoWriMo! We just sent an email to you with a confirmation link, just so we know you're the right you. Click it and you'll be up and running in just a few moments!",
  image_url: "/images/banners/wavinghand.svg",
  image_style: "image-unframed",
  button_text: "",
  button_link: "",
  dismissable: false
});
