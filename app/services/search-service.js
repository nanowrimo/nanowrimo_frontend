import Service from '@ember/service';

export default Service.extend({
  q: '',
  page: 0,
  limit: 3,
  nextPage: function() {
    this.set('page',this.get('page') + 1)
    console.log(this.get('page'))
  },
  previousPage: function() {
    this.set('page',this.get('page') - 1)
  }
})
