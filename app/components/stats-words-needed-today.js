import ChartBaseComponent from 'nanowrimo/components/chart-base-component';
import { get,computed } from '@ember/object';

export default ChartBaseComponent.extend({
  // The data must be an array of 24 numbers, one for each hour of the day, beginning at midnight
  countData: computed(function() {
    let cData = [
      {
        name: 'Me',
        data: [{
          color: '#2f3061',
          radius: '114%',
          innerRadius: '98%',
          y: 80
        }]
      },
      {
        name: 'Dave<br />Williams',
        data: [{
          color: '#edbb82',
          radius: '94%',
          innerRadius: '78%',
          y: 65
        }]
      },
      {
        name: 'Ruth Bader<br />Ginsberg',
        data: [{
          color: '#73ab9b',
          radius: '74%',
          innerRadius: '58%',
          y: 90
        }]
      }
    ];
    return cData;
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
        background: [
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
        ]
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
  }),
  chartData: computed('countData',function() {
    let cData = get(this,'countData');
    return cData;
  })


});