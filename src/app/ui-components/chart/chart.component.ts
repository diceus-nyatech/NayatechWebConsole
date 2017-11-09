import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ColorPickerService } from '../../services/color-picker.service';
import { IChartItem } from '../../interfaces/IChartItem';
import {IFeature} from '../../interfaces/IFeature';
import * as $ from 'jquery';
// export enum ChartType {
//   Pie,
//   Column
// }

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [ColorPickerService]
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() color: string;
  @Input() title: string;
  @Input() seriesName: string;
  @Input() chartItems: IChartItem[];
  @Input() yAxisName: string;
  @Input() chartType = 'column';
  @Input() yAxisMax;
  @Input() titlePosition = 'center';

  chart: Chart;
  successScore: number;


  @Output() onItemSelectEvent = new EventEmitter();

  constructor(private colorPickerService: ColorPickerService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // setTimeout(() => this.renderChart(), 100);
    // this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    const vm = this;
    if (changes['chartItems']) {
      // alert('voy voy voy');
      // setTimeout(() => this.renderChart(), 100);
      this.renderChart();
    }
  }

  renderChart() {
    const _this = this;

    if (_this.chartItems == null) {
      return;
    }
    console.log('from chart');
    console.log(_this.chartItems);
    const names: string[] = _this.chartItems.map(item => item.name);
    const values: number[] = _this.chartItems.map(item => item.value);

    if (
      names == null ||
      values == null ||
      names.length === 0 ||
      values.length === 0
    ) {
      // return;
    }

    let items: any[] = [];
    let showLegend = false;
    let maxZoom;
    let columnWidth;
    let graphWidth;
    let graphHeight;

    if (_this.chartType === 'pie') {
      showLegend = true;
      this.successScore = this.getNumbersSum(values);
      for (let index = 0; index < names.length; index++) {
        items.push({'name': names[index], 'y': values[index]});
      }
    } else {
      items = values;
      if (_this.title === 'Database migration complexity') {
        const serverNumber = items.length;
        if (serverNumber < 8) {
          graphWidth = 768;
          graphHeight = 370;
        }
        else {
          const widthCoefficient = serverNumber * 1.92;
          maxZoom = 1;
          columnWidth = 50;
          graphWidth = columnWidth * widthCoefficient;
          graphHeight = 370;
        }
      }
    }

    this.chart = new Chart({
      chart: {
        type: this.chartType,
        width: graphWidth,
        height: graphHeight,
      },
      legend: {
        enabled: showLegend
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
                formatter: function() {
                  return 't';
              }
            },
            showInLegend: true,
            point: {
              events: {
                legendItemClick: function() {
                  return false;
                }
              }
            }
        },
        series: {
          cursor: 'pointer', // Clickable chart has pointer cursor,
          allowPointSelect: true,
          point: {
            events: {
              select: this.onPointSelect.bind(this),
            }
          },
          events: {
            legendItemClick: this.onLegendItemClick.bind(this),
          },
        },
        column: {
          pointWidth: columnWidth
        }
    },
      xAxis: {
        type: 'string',
        categories: names,
        // min: 0,
        // max: 5,
        labels: {
          enabled: true
        }
        // maxZoom: maxZoom
      },
      yAxis: {
        title: {
            text: this.yAxisName
        },
        max: this.yAxisMax
      },
      title: {
        text: this.title,
        align: _this.titlePosition
      },
      tooltip: {
        formatter: function() {
          if (_this.chartType === 'column' || _this.chartType === 'bar') {
            if (_this.seriesName === 'Cost') {
              const formattedValue = _this.formatNumber(this.y);
              return `<b>${_this.seriesName}:</b> $${formattedValue}`;
            }
            else {
              return `<b>${_this.seriesName}:</b> ${this.y}`;
            }
          }
          else {
            return `<b>${this.point.name}:</b> ${this.y}`;
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: this.seriesName,
          data: items,
          color: this.getColor(),
        }
      ],
    });
  }
  getColor(): string {
    return this.colorPickerService.selectColor(this.color);
  }
  onPointSelect (e) {
    // alert('Yeeeeeah');
    if (this.chartType === 'column' || this.chartType === 'bar') {
      const selectedItem = e.target.category;
      this.onItemSelectEvent.emit(selectedItem);
    } else if (this.chartType === 'pie') {
      const featureName = e.target.name;
      const serverAndInstanceArr = this.getServerAndInstance(e.target.series.name);
      const serverName = serverAndInstanceArr[0];
      const instanceName = serverAndInstanceArr[1];

      const selectedFeature: IFeature = {serverName: serverName, instanceName: instanceName, featureName: featureName};

      this.onItemSelectEvent.emit(selectedFeature);
    }
    console.log(e);
  }

  onLegendItemClick(e) {
    // alert('opa');
  }

  // someCLick() {
  //   // alert('op');
  // }

  getNumbersSum(values: number[]) {
    const sum = values.reduce((a, b) => a + b, 0);
    return sum;
  }

  private formatNumber(value: number) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  private getServerAndInstance(name: string) {
    return name.split(':');
  }

  private getnae() {
    return this.yAxisName;
  }
}
