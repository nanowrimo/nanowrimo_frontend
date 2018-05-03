import Controller from '@ember/controller';
import { computed } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import userProfileOverviewValidation from 'nanowrimo/validations/user-profile-overview';
import userProfileBioValidation from 'nanowrimo/validations/user-profile-bio';

export default Controller.extend({
  user:null,
  userOverviewChangeset:null,
  userBioChangeset:null,
  showEditBio: false,
  showEditOverview: false,
  
  //new arrrays to fill with changed data
  newBookTitles:null,
  newAuthorNames:null,
  newExternalLinks: null,
  
  externalLinkAvailable: computed("newExternalLinks.length", function(){
    return this.get('newExternalLinks').length < 5;
  }),
  authorsAvailable: computed("newAuthors.length", function(){
    return this.get('newAuthors').length < 5;
  }),
  booksAvailable: computed("newBooks.length", function(){
    return this.get('newBooks').length < 5;
  }),
  
  init(){ 
    this._super(...arguments);
    let store = this.get('store');
    //get the user 
    return store.findRecord("user","current").then(user=>{
      this.set('user', user);
      //get the user's external_links
      store.query("externalLink", {id: user.id}).then(links=>{
        this.get('user').set('externalLinks', links);
        // store a copy of the link url values
        let lArray = links.map((l)=>{
          return {'value': l.url};
        });
        this.set('newExternalLinks', lArray);
      });
      //get the user's books
      store.query("favoriteBook", {id: user.id}).then(books=>{
        this.get('user').set('favoriteBooks', books);
        // store a copy of the book title values
        let bArray = books.map((b)=>{
          return {'value': b.title};
        });
        this.set('newBookTitles', bArray);
      });
      //get the user's authors
      store.query("favoriteAuthor", {id: user.id}).then(authors=>{
        this.get('user').set('favoriteAuthors', authors);
        // store a copy of the book title values
        let aArray = authors.map((a)=>{
          return {'value': a.name};
        });
        this.set('newAuthorNames', aArray);
      });
      
      this.set('userOverviewChangeset', new Changeset(user, lookupValidator(userProfileOverviewValidation), userProfileOverviewValidation));
      this.set('userBioChangeset', new Changeset(user, lookupValidator(userProfileBioValidation), userProfileBioValidation));
      
    });
  },
  
  actions: {
    clickedOverviewGear(){
      this.set('showEditOverview', true);
    },
    clickedBioGear(){
      this.set('showEditBio', true);
    },
    submitOverviewForm() {
      //return if the changeset is not valid
       let changeset = this.get('userOverviewChangeset');
      //has the user's name changed?
      if (changeset.change.name !== undefined ) {
        changeset.validate().then(()=>{
          //if the changeset is valid...
          if (changeset.get('isValid')) {
            //save the links
            this.handleLinkChanges();
            //save the changeset 
            return changeset.save();
          } else {
            return;
          }
        });
      } else {
        this.handleLinkChanges();
        //if the changeset is dirty, but the name isn't changed, save the changeset
        if(changeset.get('isDirty')) {
          // the name has not changed, but changeset has changes 
          changeset.save();
        }
      }
    },
    
    submitBioForm() {
      //return if the changeset is not valid
       let changeset = this.get('userBioChangeset');
      //validate the changeset
      changeset.validate();
      //if the changeset is valid...
      if (!changeset.get('isValid')) {
        return;
      }

      //TODO: genericize this code into a component 
      let nan = this.get('newAuthorNames');
      let currentAuthors = []; 
      let newFavAuthors = [];
      this.get('user').get('favoriteAuthors').forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
        currentAuthors.push(item.get('name'));
      });
      // loop through the new authors and add to the current authors
      nan.forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
        let name = item.value.trim();
        if (name !=='') {
          newFavAuthors.push(name);
          //does a user author with name already exist?
          if (currentAuthors.includes(name)) {
            //do nothing
          } else {
            //create the new author and save!
            let newAuthor = this.get('store').createRecord("favoriteAuthor");
            newAuthor.set('name', name);
            this.get('user').get('favoriteAuthors').pushObject(newAuthor);
            newAuthor.save();
          }
        }
       
      });

      //loop through the user's fav authors and remove any that have been removed 
      this.get('user').get('favoriteAuthors').forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
        let name = item.get('name');
        if ( !newFavAuthors.includes(name) ){
          //destroy the item
          item.destroyRecord();
          
          /* remove the newFavoriteAuthor that contains this name */
          nan.forEach((nb, index, array)=>{ 
            if(nb.name===name) {
              array.removeAt(index);
            }
          });
        }
      });

      let nbt = this.get('newBookTitles');
      let currentBooks = []; 
      let newBooks = [];
      this.get('user').get('favoriteBooks').forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
        currentBooks.push(item.get('title'));
      });
      // loop through the new books and add to the current books
      nbt.forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
        let title = item.value.trim();
        if (title !=='') {
          newBooks.push(title);
          //does a user book with title already exist?
          if (currentBooks.includes(title)) {
            //do nothing
          } else {
            //create the new book and save!
            let newBook = this.get('store').createRecord("favoriteBook");
            newBook.set('title', title);
            this.get('user').get('favoriteBooks').pushObject(newBook);
            newBook.save();
          }
        }
       
      });

      //loop through the user's fav books and remove any that have been removed 
      this.get('user').get('favoriteBooks').forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
        let title = item.get('title');
        if ( !newBooks.includes(title) ){
          //destroy the item
          item.destroyRecord();
          
          /* remove the newFavoriteBook that contains this title */
          nbt.forEach((nb, index, array)=>{ // eslint-disable-line no-unused-vars;
            if(nb.title===title) {
              array.removeAt(index);
            }
          });
        }
      });
      
      //don't show the form
      this.set('showEditBio', false);
      //save the changeset 
      changeset.save();
    }
  },
  handleLinkChanges() {
    let nel = this.get('newExternalLinks');
    let currentLinks = []; 
    let newLinkUrls = [];
    this.get('user').get('externalLinks').forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
      currentLinks.push(item.get('url'));
    });
    // loop through the new links and add to the current links
    nel.forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
      let url = item.value.trim();
      if (url !=='') {
        newLinkUrls.push(url);
        //does a user link with url already exist?
        if (currentLinks.includes(url)) {
          //do nothing
        } else {
          //create the new link and save!
          let newLink = this.get('store').createRecord("externalLink");
          newLink.set('url', url);
          this.get('user').get('externalLinks').pushObject(newLink);
          newLink.save();
        }
      }
    });

    //loop through the user' links and remove any that have been removed
    this.get('user').get('externalLinks').forEach((item,index,array)=>{ // eslint-disable-line no-unused-vars
      let url = item.get('url');
      if ( !newLinkUrls.includes(url) ){
        //destroy the item
        item.destroyRecord();
        
        /* remove the newExternalLink that contains this url */
        //let nel = this.get('newExternalLinks');
        nel.forEach((el,index,array)=>{ // eslint-disable-line no-unused-vars;
          if(el.url===url) {
            array.removeAt(index);
          }
        });
      }
    });
     //save the changeset 
      
    //don't show the form
    this.set('showEditOverview', false);
  }
});
