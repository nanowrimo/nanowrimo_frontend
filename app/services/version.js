import Service from '@ember/service';

export default Service.extend({
  outdated: false,
  initTime: null,
  
  init() {
    this._super(...arguments);
    // get the init time
    this.set('initTime', new Date() );
    
    //bind ... because 'javascript'
    let checkVer = this.checkVersion.bind(this);
    window.setInterval(checkVer, 3000 );
  },
  
  checkVersion: function() {
    fetch("/ui-update.txt").then(data=>{ 
        data.text().then( txt =>{
          let versionTime = new Date(txt);
          let initTime = this.get('initTime');
          // is versionTime greater than initTime?        
          this.set('outdated', (initTime < versionTime));
        });
    });
  }
  
});
