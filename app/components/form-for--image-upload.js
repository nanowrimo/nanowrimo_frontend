import Component from '@ember/component';
import { get, set }  from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ENV from 'nanowrimo/config/environment';

const ACCEPTED_MIME_TYPES = "image/jpeg,image/png,image/gif"
const DIRECT_UPLOAD_URL = '/rails/active_storage/direct_uploads';

/* the image upload is using ember-file-upload 
 * https://adopted-ember-addons.github.io/ember-file-upload/docs
 */


export default Component.extend({
  activeStorage: service(),

  accept: ACCEPTED_MIME_TYPES,
  changeset: null,
  hasAttemptedSubmit: false,
  hasUploaded: false,
  label: '',
  progress: 0,
  property: '',
  type: 'text',
  validFile: false,
  name: reads('property'),

  actions: {
    uploadImage(file) {
      let uploadFile;
      let validTypes = ACCEPTED_MIME_TYPES.split(',');
      if (file.dataTransfer && file.dataTransfer.files) {
        // Get File if it has come from the dropzone
        uploadFile = file.dataTransfer.files.item(0);
      } else if (file.blob) {
        // Get File if it has been manually selected
        uploadFile = file.blob
      }

      if (uploadFile) {
        //check that the file type is acceptable 
        if (!validTypes.includes(uploadFile.type ) ){
          this.set('validFile', false);
          return;
        } else {
          this.set('validFile', true);
        }
        let uploadUrl = `${ENV.APP.API_HOST}${DIRECT_UPLOAD_URL}`;
        this.get('activeStorage').upload(uploadFile, uploadUrl, {
          onProgress: progress => {
            this.set('progress', progress);
          }
        }).then(blob => {
          set(file, 'state', 'uploaded');
          set(this.get('changeset'), this.get('property'), get(blob, 'signedId'));
          this.set('hasUploaded', true);
        }).catch(error => {
          alert(error);
        });
      }
    }
  }
});
