import NwFlippyCard from 'nanowrimo/components/nw-flippy-card';
import { computed } from '@ember/object';


export default NwFlippyCard.extend({
  project: null,

  hasPlaylistOrPinterest: computed('project.[playlistUrl,pinterestUrl]', function(){
    // get the project
    let p = this.get('project');
    // is there a project?
    if (p) {
      // is the playlistUrl or pinterestUrl not null?
      return (p.playlistUrl!=null || p.pinterestUrl != null);
    } else {
      return false;
    }
  })
    
});
