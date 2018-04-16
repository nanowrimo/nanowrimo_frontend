import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      panels: [
        {
          cards: [
            { title: "My Badges", class: "g3-col1 g3-row1 g3-hspan2 g3-vspan1 g2-col1 g2-row1 g2-hspan2 g2-vspan1", templateName: "authenticated/projects" },
            { title: "My Buddies", class: "g3-col3 g3-row1 g3-hspan1 g3-vspan2 g2-col2 g2-row3 g2-hspan1 g2-vspan2", templateName: "authenticated/projects" },
            { title: "Regions", class: "g3-col1 g3-row2 g3-hspan2 g3-vspan1 g2-col1 g2-row2 g2-hspan2 g2-vspan1", templateName: "authenticated/projects" },
            { title: "Writer's Resources", class: "g3-col1 g3-row3 g3-hspan1 g3-vspan1 g2-col1 g2-row3 g2-hspan1 g2-vspan1", templateName: "authenticated/projects" },
            { title: "NaNo Store", class: "g3-col2 g3-row3 g3-hspan1 g3-vspan1 g2-col1 g2-row4 g2-hspan1 g2-vspan1", templateName: "authenticated/projects" },
            { title: "My Offers", class: "g3-col3 g3-row3 g3-hspan1 g3-vspan1 g2-col1 g2-row5 g2-hspan1 g2-vspan1", templateName: "authenticated/projects" }
          ]
        }
      ]
    };
  }
});
