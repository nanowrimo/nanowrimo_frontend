import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  chartOptions: computed(function() {
    let cOptions = {
      chart: {
        type: 'spline'
      },
      title: null,
      xAxis: {
        categories: ['Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16']
      },
      yAxis: {
        title: null,
      },
      tooltip: {
        valueSuffix: '°C'
      },
      plotOptions: {
          spline: {
              marker: {
                  enable: false
              }
          }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        horizontalAlign: 'middle',
        borderWidth: 0
      }
    };
    return cOptions;
  }),

  chartData: computed(function() {
    let cData = [
      {
        name: 'My word count',
        type: 'spline',
        data: [0, 1299, 1300, 1300, 1500, 2397, 3465, 3300, 5500]
      },
      {
        name: "Dave Williams' word count",
        type: 'spline',
        data: [0, 2299, 2300, 4300, 5500, 12397, 13465, 15300, 15500]
      },
      {
        name: "Path to success",
        type: 'line',
        connectNulls: true,
        data: [0, null, null, 3000, null, null, null, 7000, null, null, null, 10000,null, null, null, 20000, null, null, null, 27000, null, null, null, 30000,null, null, null, 43000, null, null, 50000]
      }
    ];
    return cData;
  })

});