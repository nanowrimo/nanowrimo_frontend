import Service from '@ember/service';

export default Service.extend({
  outdated: false,
  initTime: null,
  
  init() {
    this._super(...arguments);
    // get the init time
    this.set('initTime', new Date() );
    
    console.log( this.get('initTime') );
    window.setInterval(this.checkVersion, 3000 );
  },
  
  checkVersion: function() {
    fetch("/ui-update.txt").then(data=>{ 
        data.text().then( txt =>{
          let versionTime = new Date(txt);
          console.log(versionTime);
          
        });
    });
  }
  
});
