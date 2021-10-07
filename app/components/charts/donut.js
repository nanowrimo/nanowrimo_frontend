import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  pingService: service(),

  paneBackgrounds: null,
  eventType: null,
  showIcon: true,
  classNames: ['nw-square-80 chart-donut'],
  updateCount: 0,
  
  init(){
    this._super(...arguments);
    setInterval(this.incrementUpdateCount, 2000, this);
    
    // Donut charts have two rings, the outer one for overall progress, the inner one for daily progress
    this.set('paneBackgrounds', [
      {
        outerRadius: '117%',
        innerRadius: '93%',
        backgroundColor: '#DFE4E6',
        borderWidth: 0
      },
      {
        outerRadius: '88%',
        innerRadius: '64%',
        backgroundColor: '#DFE4E6',
        borderWidth: 0
      },
    ]);
  },
  
  incrementUpdateCount: function(_this){
    let updateCount = _this.get('updateCount');
    _this.set('updateCount', updateCount+1);
  },
    
  pps: function() {
    const buddiesData = this.get('pingService.buddiesData');
    const buddyId = this.get('user.id');
    let pps = null;
    for (let i = 0; i<buddiesData.length; i++) {
      if (buddiesData[i].user_id == buddyId) {
        pps = JSON.parse(buddiesData[i].primary_project_state);
      }
    }
    return pps;
  },
  
  overallProgress: computed('pingService.buddiesData.{[],@each.updated_at}', 'updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps) {
      return Math.min(Math.round((pps.current_word_count/pps.goal_total)*100),100);
    } else {
      return 100;
    }
    
  }),
  
  dailyProgress: computed('pingService.buddiesData.{[],@each.updated_at}', 'user', 'updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps) {
      return Math.min(Math.round((pps.daily_total/(pps.goal_total/pps.challenge_days))*100),100);
    } else {
      return 0;
    }
  }),
  
  // Hides the center icon on mouseover so the tooltip can be read
  mouseEnter(){
    this.set('showIcon',false);
  },
  
  // Displays the center icon on mouseout after the tooltip has disappeared
  mouseLeave(){
    this.set('showIcon',true);
  },
  
  // Sets whether there's an icon for this challenge
  iconNeeded: computed('eventType', function() {
    switch(this.get('eventType')) {
      case 0: // This is a November event
        return true;
        break;
      case 1: // This is a Camp event
        return true;
        break;
      default: // This is any other kind of event
        return false;
    }
  }),
  
  // Sets the center icon source
  iconSrc: computed('eventType', function() {
    switch(this.get('eventType')) {
      case 0: // This is a November event
        return '/images/global/helmet.svg';
        break;
      case 1: // This is a Camp event
        return '/images/global/tent-blue.svg';
        break;
      default: // This is any other kind of event
        return '';
    }
  }),
  
  // Sets the center icon alt text
  iconAlt: computed('eventType', function() {
    switch(this.get('eventType')) {
      case 0: // This is a November event
        return 'Helmet icon for November challenges';
        break;
      case 1: // This is a Camp event
        return 'Tent icon for Camp challenges';
        break;
      default: // This is any other kind of event
        return '';
    }
  }),
  
  // Returns the hex color of the outer ring depending on event type and winning
  outerColor: computed('eventType','overallProgress', function() {
    if (this.get('overallProgress')>=100) { // If the user has won, show a purple ring
      return '#834DA9';
    } else { // If the user hasn't won, the ring color depends on the event type
      switch(this.get('eventType')) {
        case 0: // This is a November event
          return '#A5D9E4';
          break;
        case 1: // This is a Camp event
          return '#1B75BB';
          break;
        default: // This is any other kind of event
          return '#005555';
      }
    }
  }),
  
  // Sets the ring colors, radii, and percentage
  chartData: computed('overallProgress','dailyProgress',function() {
    let cFormat = [];
    const overallProgress = {
      name: "Overall progress",
      data: [{
        color: this.get('outerColor'),
        radius: '117%',
        innerRadius: '93%',
        y: this.get('overallProgress'),
      }]
    };
    cFormat.pushObject(overallProgress);
    const dailyProgress = {
      name: "Daily Progress",
      data: [{
        color: '#F4A261',
        radius: '88%',
        innerRadius: '64%',
        y: this.get('dailyProgress'),
      }]
    };
    cFormat.pushObject(dailyProgress);
    return cFormat;
  }),


  // Options for Highcharts
  chartOptions: computed(function() {
    let cOptions = {
      chart: {
        type: 'solidgauge',
        height: 80,
        width: 80,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        backgroundColor:'rgba(0, 255, 255, 0.0)',
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: this.get('paneBackgrounds')
 
      },
      title: {
        text: null
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        hideDelay: 0, // Hide the tooltip immediately without a delay
        style: {
          fontSize: '9px'
        },
        pointFormat: '<span style="font-size:1.8em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth, labelHeight) {
          return {
            x: (this.chart.chartWidth - labelWidth) / 2,
            y: ((this.chart.plotHeight - (labelHeight/2)) / 2.2)
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
