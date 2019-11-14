import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { get,computed } from '@ember/object';

export default ChartBaseComponent.extend({

  countData: computed('myChartType','userDailyAggregates.[]',function() {
    let cData = [
      {
        name: 'My count',
        type: get(this,'myChartType'),
        color: '#2f3061',
        
        data: this.get('userData')
      }
      // TODO: if making comparisons with other users, push that data onto the cData 
     
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
        height: 300
      },
      title: null,
      xAxis: {
        categories: this.get('xAxisRange'),
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
        enabled: false
      }
    };
    return cOptions;
  }),

  chartData: computed('countData',function() {
    let cData = get(this,'countData');
    return cData;
  }),
  
  userData: computed('userDailyAggregates.[]', function(){
    let aggs = this.get('userDailyAggregates');
    if(aggs) {
      return Object.values(aggs);
    }
  }),
  xAxisRange: computed('userDailyAggregates.[]', function(){
    let aggs = this.get('userDailyAggregates');
    if(aggs) {
      return Object.keys(aggs);
    }
  })
});
