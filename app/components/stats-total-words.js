import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { computed } from '@ember/object';

export default ChartBaseComponent.extend({
  userPercentData: null,
  comparisonPercentData: null, // will be an array
  colorsAndRadius: null,
  
  init(){
    this._super(...arguments);
    //create an array of colors and radiuses. radii?
    this.set('colorsAndRadius', [
      {
        color: '#2f3061',
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
    this.set('comparisonPercentData', []);
  },
  
  countData: computed('userPercentData','comparisonPercentData', function(){
    let data = [];
    data.pushObject(this.get('userPercentData') );
    //append the comparisonPercentData
    let cpd = this.get('comparisonPercentData');
    if (cpd) {
      cpd.forEach((d)=>{
        data.pushObject(d);
      });
    }
    return data;
  }),
  
  paneBackground: computed('countData', function(){
    let l = this.get('countData.length');
    let pbgs = this.get('paneBackgrounds');
    var bg = [];
    for (var i = 0 ; i < l ; i++) {
      bg.pushObject(pbgs[i]);
    }
    return bg;
  }),
  
  chartData: computed('countData', function() {
    let cd = this.get('countData');
    let car = this.get('colorsAndRadius');
    let cFormat = [];
    for (var i =0; i < cd.length ; i++) {
      // get the count data for user i
      var c = cd[i];
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
      var fThingy = {
        name: c.name,
        data: [{
          color: cr.color,
          radius: cr.radius,
          innerRadius: cr.innerRadius,
          y: c.percent
        }]
      };
      //append the thingy to the cFormat array
      cFormat.pushObject(fThingy);
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
        background: this.get('paneBackground')
 
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
