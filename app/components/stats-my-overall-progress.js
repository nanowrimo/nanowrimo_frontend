import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { get,computed } from '@ember/object';
import moment from 'moment';

export default ChartBaseComponent.extend({
  chartType: null,
  
  init() {
    this._super(...arguments);
    this.set('chartType', 'line');
  },
  
  tableSelected: computed("chartType", function(){
    return this.get('chartType')=="table";
  }),
  lineChartSelected: computed("chartType", function(){
    return this.get('chartType')=="line";
  }),
  barChartSelected: computed("chartType", function(){
    return this.get('chartType')=="bar";
  }),
  
  
  tableRows: computed("successData.[]", "userDailyTotals.[]", function(){
    let responseData = []
    // get the data 
    let success = this.get('successData');
    let totals = this.get('userDailyTotals');
    let dates = this.get('projectChallenge.datesShortMonthDayFormat');
    // loop through the dates 
    for (var i = 0; i < dates.length; i++) {
      responseData.pushObject({"date": dates[i], "success": success[i], "total": totals[i]});
    }
    return responseData;
  }),
  
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
  countData: computed('myChartType','projectChallenge.dailyAggregates.[]',function() {
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

  myChartType: computed('chartType',function() {
    switch (this.get('chartType') ){
      case 'table':   
        return '';
      case "line": 
        return "spline";
      case "bar": 
        return "column";
    }
  }),
  chartId: computed('chartType', function() {
    return `pane-${this.get('chartType')}-chart`;
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
  }),
  
  // determine the user's daily totals based on the days in the challenge and the dailyAggregates
  userDailyTotals: computed('projectChallenge.dailyAggregates.[]', function() {
    let dailyAggs = this.get('projectChallenge.dailyAggregates');
    let dates = this.get('projectChallenge.dates');
    if(dailyAggs) {
      let totals = [];
      //loop through the dates that the project will be active
      for(var i=0; i < dates.length; i++) {
        var date = dates[i];
        //if the date is in the future...
        if(moment(date).isAfter()) {
          break;
        }
        // find the daily aggregate for the date
        var agg = dailyAggs.filterBy('day', date)[0];
        var val = 0;
        if (agg) {
          val = agg.count;
        }
        
        var tval = val;
        if(i > 0) {
          tval +=totals[i-1];
        }
        totals[i] = tval; 
      }
      return totals;
    } else {
      return [];
    }
  }),
    actions: {
    setChartType: function(val){
      this.set('chartType', val);
    }
  }
});
