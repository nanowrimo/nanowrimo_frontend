import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { computed } from '@ember/object';

export default ChartBaseComponent.extend({

  // Finds the hour with the maximum count
  maxHour: computed('projectChallenge.when', function() {
    var pcwhen = this.get('projectChallenge.when');
    return pcwhen;
  }),
  hasData: computed('projectChallenge.when', function(){
    var pcwhen = this.get('projectChallenge.when');
    return (pcwhen!==null);
  }),

  // Gets the animal type from time period with the most writing
  animalType: computed('maxHour',function() {
    var mHour = this.get('maxHour');
    if (mHour<5) {
      return "nightowl";
    } else if (mHour<12) {
      return "earlybird";
    } else if (mHour<19) {
      return "flamingo";
    } else {
      return "nightowl";
    }
  }),
  
  // Returns the catchy phrase for each animal type
  catchyPhrase: computed('animalType',function() {
    let str = "";
    switch(this.get('animalType') ){
      case "earlybird":
        str = "The early bird gets the worm!";
        break;
      case "flamingo":
        str = "What's up, mid-day flamingo?";
        break;
      case "nightowl":
        str = "Hoot hoot, you're a night owl!"
    }
    return str;
  }),
  
  // Returns the time frame as a phrase
  dataPhrase: computed('maxHour',function() {
    return this._timeHourString(this.get('maxHour'),' and ');
  }),
  
  // Options for Highcharts
  chartOptions: computed(function() {
    // Set _this equal to component for later reference
    let _this = this;
    // Get the user data
    let aData = this.get('countData');
    // Figure out the max value
    let mValue = Math.max(...aData);
    // Set the Highcharts options
    let cOptions = {
      chart: {
        type: 'column',
        height: 200,
        marginTop: 0,
        spacingTop: 0,
        backgroundColor:'rgba(255, 255, 255, 0.0)'
      },
      legend: {
        enabled: false
      },
      title:{
        text: null,
        style: {
          display: 'none'
        }
      },
      subtitle:{
        text: null,
        style: {
          display: 'none'
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
        },
        formatter: function() {
          return _this._timeHourString(this.x,'-');
        }
      },
      xAxis: {
        lineColor: 'rgba(223, 228, 230, 1.0)',
        tickPositions: [0,12,23],
        tickLength: 0,
        title: null,
        labels: {
          style: {
            color: '#979797',
            fontSize: 13,
          },
          formatter: function () {
            return _this._shortTimeString(this.value);
          }
        }
      },
      yAxis: {
        title: null,
        gridLineWidth: 0,
        visible: false,
        endOnTick: false
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

  chartData: computed('countData',function() {
    let cData = [
      {
        data: this.get('countData')
      },
    ];
    return cData;
  })
  
  
});
