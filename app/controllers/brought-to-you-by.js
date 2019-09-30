import Controller from '@ember/controller';
import { computed } from '@ember/object';


export default Controller.extend({
  
  monthlyDonorString: computed('model.[]', function() {
    let m = this.get('model');
    let md = m.monthly;
    let names = [];
    md.forEach((d)=>{ 
      names.push(d.name); 
    });
    return names.join(", ");
  }),
  
  majorDonorString: computed('model.[]', function() {
    let m = this.get('model');
    let md = m.major;
    let names = [];
    md.forEach((d)=>{ 
      names.push(d.name); 
    });
    return names.join(", ");
  }),
  
  supportingDonorString: computed('model.[]', function() {
    let m = this.get('model');
    let md = m.supporting;
    let names = [];
    md.forEach((d)=>{ 
      names.push(d.name); 
    });
    return names.join(", ");
  })
  
});
