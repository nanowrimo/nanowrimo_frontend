import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      panels: [
        {
          cards: [
            { title: "Card 1" },
            { title: "Card 2" },
            { title: "Card 3" }
          ]
        },
        {
          cards: [
            { title: "Card 4" },
            { title: "Card 5" }
          ]
        }
      ]
    };
  }
});
