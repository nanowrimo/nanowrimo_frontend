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
        
        data: [500,800,0,50,900,3000,456,789,987,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
      },
      {
        name: "Dave Williams' word count",
        type: 'spline',
        color: '#edbb82',
        
        data: [0, 0, 400, 1667, 1667, 99, 3000, 444, 555,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
      },
    ];
    return cData;
  }),

  myChartType: computed('primaryDisplay',function() {
    if (get(this,'primaryDisplay')) {
      return 'column';
    } else {
      return 'spline';
    }
  }),
  chartOptions: computed(function() {
    // Set _this equal to component for later reference
    // let _this = this;
    let cOptions = {
      chart: {
        type: 'spline',
        height: 300
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