import ScrollRoute from 'nanowrimo/routes/scroll-route'

export default ScrollRoute.extend({
  model() { // unless model returns a promise, the 'loading' graphic is never hidden
    return new Promise((resolve)=> {resolve();});
  }
});
