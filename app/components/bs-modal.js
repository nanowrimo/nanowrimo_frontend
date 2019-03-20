import BSModalComponent from 'ember-bootstrap/components/bs-modal';
import ENV from 'nanowrimo/config/environment';

export default BSModalComponent.extend({
  backdropTransitionDuration: ENV.APP.MODAL_BACKGROUND_TRANSITION_MS,
  transitionDuration: ENV.APP.MODAL_TRANSITION_MS,
  backdropClose: false
});
