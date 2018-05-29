import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { get,computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default ChartBaseComponent.extend({

  countData: computed('myChartType',function() {
    // Set _this equal to component for later reference
    let _this = this;
    let cData = [
      {
        name: 'My word count',
        type: get(this,'myChartType'),
        color: '#2f3061',
        data: [0, 1299, 1300, 1300, 1500, 2397, 3465, 3300, 5500]
      },
      {
        name: "Dave Williams' word count",
        type: 'spline',
        color: '#edbb82',
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
  }),

  myChartType: computed('primaryDisplay',function() {
    if (get(this,'primaryDisplay')) {
      return 'spline';
    } else {
      return 'column';
    }
  }),
  chartOptions: computed(function() {
    // Set _this equal to component for later reference
    // let _this = this;
    let cOptions = {
      chart: {
        type: 'spline',
        height: 300,
        reflow: true
      },
      title: null,
      xAxis: {
        categories: ['Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Today', 'Nov 10', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16','Nov 17', 'Nov 18', 'Nov 19', 'Nov 20', 'Nov 21', 'Nov 22', 'Nov 23', 'Nov 24', 'Nov 25', 'Nov 26', 'Nov 27', 'Nov 28', 'Nov 29', 'Nov 30'],
        tickPositions: [0,8,29],
        tickLength: 0,
        title: null,
        labels: {
          style: {
            color: '#979797',
            fontSize: 13,
          }
        }
      },
      yAxis: {
        title: null,
        endOnTick: false,
        gridLineWidth: 2,
        labels: {
          style: {
            color: '#b8b8b8',
            fontSize: 11
          }
        }
      },
      plotOptions: {
          spline: {
            marker: {
              enable: false
            }
          },
          column: {
            pointPadding: 0,
            borderRadius: 7,
            borderWidth: 0,
            strokeWidth: 0,
          }
      },
      tooltip: {
        backgroundColor: {
          linearGradient: [0, 0, 0, 60],
          stops: [
            [0, '#e2eff3'],
            [1, '#d5e2e6']
          ]
        },
        borderWidth: 1,
        borderColor: '#d5e2e6',
        borderRadius: 6,
        style: {
          color: '#73ab9b'
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

  chartData: computed('countData',function() {
    let cData = get(this,'countData');
    return cData;
  })
  

});