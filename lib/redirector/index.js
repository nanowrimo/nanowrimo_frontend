'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },
  
  contentFor: function(type, config){
    // we are only interested in 'pre-head' type for contentFor
    if (type === 'pre-head'){
      let host = config.APP.UI_HOST;
      return `<script>
      if (!window.location.href.startsWith("${host}")) {
        window.location.replace("${host}");
      }
      </script>`;      
    }
  }
};
