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
    // get the fractionalCount/day
    let fcpd = pc.fractionCountPerDay;
    for (var i=0; i < pc.duration; i++) {
      let v = Math.round( (i+1)*fcpd );
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
        //color: '#659dae',
        color: '#558d9e',
        data: this.get('userDailyTotals')
      }
    ];

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
        categories: this.get('projectChallenge.datesShortMonthDayYearFormat'),
        // tick labels are at the first and last day of the challenge
        tickPositions: [0,this.get('projectChallenge.duration')-1],
        tickLength: 0,
        title: null,
        labels: {
          style: {
            color: '#979797',
            fontSize: 14,
            fontWeight: "bold",
          }
        }
      },
      yAxis: {
        title: null,
        endOnTick: false,
        gridLineWidth: 2,
        gridLineColor: '#939393',
        labels: {
          style: {
            color: '#979797',
            fontSize: 14,
            fontWeight: "bold"
          }
        }
      },
      plotOptions: {
        series: {
          color: '#959595'
        },
          spline: {
            marker: {
              enable: false
            }
          },
          column: {
            pointPadding: 0,
            borderRadius: 3,
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
          //color: '#73ab9b'
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
