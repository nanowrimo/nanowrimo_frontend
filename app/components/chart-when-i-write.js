import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { get,computed } from '@ember/object';

export default ChartBaseComponent.extend({
  // The data must be an array of 24 numbers, one for each hour of the day, beginning at midnight
  countData: computed(function() {
    let cData = [1000,0,0,10,50,200, 300, 500, 1000, 1100, 1200, 1250, 800, 500, 300, 200, 100, 50, 0, 0, 0, 0,0,1000];
    return cData;
  }),
  
  chartOptions: computed(function() {
    let aData = get(this,'countData');
    let mValue = Math.max(...aData);
    let _this = this;
    let cOptions = {
      chart: {
        type: 'column',
        backgroundColor:'rgba(255, 255, 255, 0.0)',
        reflow: true
      },
      title: null,
      legend: {
        enabled: false
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
        formatter: function() {
          return _this._timeHourString(this.x);
        }
      },
      xAxis: {
        lineColor: 'rgba(223, 228, 230, 1.0)',
        tickPositions: [0,12,23],
        tickLength: 0,
        title: null,
        labels: {
          formatter: function () {
            return _this._shortTimeString(this.value);
          }
        }
      },
      yAxis: {
        title: null,
        gridLineWidth: 0,
        visible: false
      },
      plotOptions: {
        column: {
          pointWidth: 9,
          borderRadius: 5,
          borderWidth: 0,
          strokeWidth: 0,
          zones: [
            {
              value: mValue/4,
              color: '#dfe4e6'
            },
            {
              value: mValue/2,
              color: '#a5d9e4'
            },
            {
              value: 3*mValue/4,
              color: '#75abbc'
            },
            {
              color: '#73ab9b'
            }]
        }
      },
    };
    return cOptions;
  }),

  chartData: computed(function() {
    let cData = [
      {
        data: get(this,'countData')
      },
    ];
    return cData;
  })
  
  
});