import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { get,computed } from '@ember/object';

export default ChartBaseComponent.extend({
  
  successData: computed('projectChallenge', function() {
    let pc = this.get('projectChallenge');
    let data = [];
    for (var i=0; i < pc.duration; i++) {
      let v = (i+1)*pc.countPerDay;
      if (i==pc.duration-1) {
        //this is the last day
        v = pc.goal;
      }
      data.push(v)
    }
    return data;
  }),
  countData: computed('myChartType','userDailyTotals.[]',function() {
    let cData = [
      {
        name: 'My count',
        type: get(this,'myChartType'),
        color: '#2f3061',
        data: this.get('userDailyTotals')
      }
    ];
    //TODO: if comparison data, create object, push object onto cData
    /*
    {
      name: "Dave Williams' word count",
      type: 'spline',
      color: '#edbb82',
      data: [0, 2299, 2300, 4300, 5500, 12397, 13465, 15300, 15500]
    },
    {
      name: "Path to success",
      type: 'line',
      dashStyle: 'ShortDash',
      connectNulls: true,
      data: [0, null, null, 3000, null, null, null, 7000, null, null, null, 10000,null, null, null, 20000, null, null, null, 27000, null, null, null, 30000,null, null, null, 43000, null, null, 50000]
    }
    * 
    */ 
     
     //
    let successPath = {
      name: "Path to success",
      type: 'line',
      dashStyle: 'ShortDash',
      connectNulls: true,
      data: this.get('successData')
    }
     
    //push the path to success onto the cData array
    cData.push(successPath);
    return cData;
  }),

  myChartType: computed('primaryDisplay',function() {
    if (get(this,'primaryDisplay')) {
      return 'spline';
    } else {
      return 'column';
    }
  }),
  chartOptions: computed('projectChallenge', function() {
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
        categories: this.get('projectChallenge.datesShortMonthDayFormat'),
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
  })
});
