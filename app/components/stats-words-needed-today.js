import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { computed } from '@ember/object';

export default ChartBaseComponent.extend({
  userUnitsToday: null,
  colorsAndRadius: null,
  comparisonUnitsTodayData: null,
  
  init(){
    this._super(...arguments);
    //create an array of colors and radiuses. radii?
    this.set('colorsAndRadius', [
      {
        color: '#73ab9b',
        radius: '114%',
        innerRadius: '98%'
      }, 
      {
        color: '#edbb82',
        radius: '94%',
        innerRadius: '78%'
      },
      {
        color: '#73ab9b',
        radius: '74%',
        innerRadius: '58%'
      }  
    ]); 
    this.set('paneBackgrounds', [
      {
        outerRadius: '114%',
        innerRadius: '98%',
        backgroundColor: '#e8e8e8',
        borderWidth: 0
      },
      {
        outerRadius: '94%',
        innerRadius: '78%',
        backgroundColor: '#e8e8e8',
        borderWidth: 0
      },
      {
        outerRadius: '74%',
        innerRadius: '58%',
        backgroundColor: '#e8e8e8',
        borderWidth: 0
      }
    ]);
  },

  disabled: computed('projectChallenge.{hasStarted,hasEnded}', function(){
    let pc = this.get('projectChallenge');
    if (pc.hasStarted && !pc.hasEnded) {
      return false;
    } else {
      return true;
    }
  }),

  projectChallengeHasNotStarted: computed('projectChallenge.hasStarted', function(){
    return !this.get('projectChallenge.hasStarted');
  }),
  
  percentNeededToday: computed('projectChallenge.{daysRemaining,todayCount}', function(){
    let pc = this.get('projectChallenge');
    if (pc) {
      if (!pc.hasStarted || pc.hasEnded) {
        return 0;
      }
      //countToday
      let todayCount = this.get('projectChallenge.todayCount');
      let countPerDay = this.get('countNeededToday')
      let percent = Math.round(todayCount*100/countPerDay);
      return percent;
    }
  }),
  
  countNeededToday: computed("projectChallenge.{daysRemaining,todayCount}", function(){
    let pc = this.get('projectChallenge');
    if (pc) {
      if (!pc.hasStarted || pc.hasEnded) {
        return 0;
      }
      //countRemaining
      let countRemaining = this.get('projectChallenge.countRemaining');
      //daysRemaining
      let daysRemaining = this.get('projectChallenge').daysRemaining();
      //countToday
      let todayCount = this.get('projectChallenge.todayCount');
      let needed = Math.round((countRemaining+todayCount) / daysRemaining);
      if (needed) {
        return needed;
      } else {
        return 0;
      }
    }
  }),
 
  // does the passed in projectChallenge has aggregates loaded?
  hasAggregates: computed("projectChallenge.dailyAggregates.[]", function(){
    let pc = this.get('projectChallenge');
    if (pc) {
      return pc.dailyAggregates !== null;
    } else {
      return false;
    }
  }),
  
  paneBackground: computed('unitsTodayData', function(){
    let l = 1;//= this.get('unitsTodayData.length');
    let pbgs = this.get('paneBackgrounds');
    var bg = [];
    for (var i = 0 ; i < l ; i++) {
      bg.pushObject(pbgs[i]);
    }
    return bg;
  }),


  chartData: computed('countNeededToday','percentNeededToday','disabled', function() {
    let car = this.get('colorsAndRadius');
    let cFormat = [];
    for (var i =0; i < 1 ; i++) {
      // get the count data for user i
      //var c = ud[i];
      //create the percent complete based on count and goal
      var percent = this.get('percentNeededToday');
      
      //get the colors and radius number i
      var cr = car[i];
      //build a formatted thingy 
      /* format: 
      {
        name: 'Me',
        data: [{
          color: '#2f3061',
          radius: '114%',
          innerRadius: '98%',
          y: 80
        }]
      } 
      */
      // color will depend upon if the ui should look disabled
      let d = this.get('disabled');
      let col = (d) ? "#e8e8e8" : cr.color;
      
      var fThingy = {
        name: null,//c.name,
        data: [{
          color: col,
          radius: cr.radius,
          innerRadius: cr.innerRadius,
          y: percent
        }]
      };
      //append the thingy to the cFormat array
      cFormat.push(fThingy);
    }
    return cFormat;
  }),


  // Options for Highcharts
  chartOptions: computed(function() {
    let cOptions = {
      chart: {
        type: 'solidgauge',
        height: 114,
        width: 114,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        backgroundColor:'rgba(255, 255, 255, 0.0)',
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: this.get('paneBackground'),
        
      },
      title: {
        text: null
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
          fontSize: '10px'
        },
        pointFormat: '<span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth, labelHeight) {
          return {
            x: (this.chart.chartWidth - labelWidth) / 2,
            y: ((this.chart.plotHeight - (labelHeight/2)) / 2)
          };
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: []
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true,
        }
      },
    };
    return cOptions;
  })


});
