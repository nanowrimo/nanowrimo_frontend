import Component from '@ember/component';
import {select} from 'd3-selection';
import {csv} from 'd3-fetch';

export default Component.extend({
 
  getData: async () => {
  const data = await csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4miU2yF1wGCB2lqTVmsu9TcVdvNV_SxLRBxri5aAraCCt-7uoU9R7Rk1QgUjv9InRyNZsV4FAjZBk/pub?gid=1450622436&single=true&output=csv"
  );
  var myArray = [];
        data.forEach((d) => {
          d["novel_name"] = String(d["Name of Novel"]);
          d["username"] = String(d["Username"]);
          d["date"] = d["Date "];
          myArray.push([d.novel_name, d.username, d.date]);
        });

  },
  didInsertElement() {
    let table = select(this.$('svg')[0]).append("table");
    let header = table.append("thead").append("tr");
    let data=this.getData.myArray
    header
    .selectAll("th")
    .data(data.columns.slice(1))
    .enter()
    .append("th")
    .text(function (d) {
      return d;
    });
    let tablebody = table.append("tbody");
    let rows = tablebody.selectAll("tr").data(data).enter().append("tr");
    let cells = rows
    cells
      .selectAll("td")
      .data(function (d) {
        return d;
      })
      .enter()
      .append("td")
      .text(function (d) {
        return d;
      });
  }

});