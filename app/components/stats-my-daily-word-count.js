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
  
  tableRows: computed( "userDailyCounts.[]", function(){
    let responseData = []
    // get the data 
    let counts = this.get('userDailyCounts');
    // get the keys from the counts object
    let keys = Object.keys(counts);
    let dates = this.get('projectChallenge.datesShortMonthDayFormat');
    // loop through the dates 
    for (var i = 0; i < dates.length; i++) {
      let countKey = keys[i];
      let c = counts[countKey];
      responseData.pushObject({"date": dates[i], "count": c});
    }
    return responseData;
  }),
  
  countData: computed('myChartType','userDailyCounts.[]',function() {
    let cData = [
      {
        name: 'My count',
        type: get(this,'myChartType'),
        //color: '#2f3061',
        color: '#558d9e',
        
        data: this.get('userData')
      }
      // TODO: if making comparisons with other users, push that data onto the cData 
     
    ];
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
  
  chartOptions: computed('xAxisRange', function() {
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
            fontSize: 14,
            fontWeight: "bold"
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
  
  userData: computed('userDailyCounts.[]', function(){
    let counts = this.get('userDailyCounts');
    if(counts) {
      return Object.values(counts);
    } else {
      return [];
    }
  }),
  xAxisRange: computed('projectChallenge', function(){
    return this.get('projectChallenge.dates');
  }),
  
  userDailyCounts: computed('projectChallenge.dailyAggregates.[]', function() {
    let das = this.get('projectChallenge.dailyAggregates');
    let dates = this.get('projectChallenge.dates');
    // were dates found?
    if(dates && das) {
      let today = moment().format("YYYY-MM-DD");
      let todayFound = false;
      //create an counts array
      let counts = {};
      //loop through the dates
      for (var i = 0; i < dates.length; i++) {
        // use the date as a key
        let key = dates[i];
        if (todayFound) {
          counts[key] = null;
        } else {
          counts[key] = 0;
        }
        if (key == today) {
          todayFound = true;
        }
      }
      
      //loop the dailyAggregates
      das.forEach((da)=>{
        var k = da.day;
        counts[k]+=da.count;
      });
      return counts;
      
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
