import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from "moment";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTooltip, ApexPlotOptions, ApexLocale
} from "ng-apexcharts";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {CandlestickChartService} from "./sercice/candlestick-chart.service.service";

export interface ChartData {
  'x': Date,
  'y': Array<number>,
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions,
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.scss']
})

export class CandlestickChartComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  data: string;
  values: Array<number> = [];
  chartData: Array<ChartData> = []

  constructor(private chartService: CandlestickChartService) {
    this.chartUpdate();
  }

  public updateSeries(data: Array<ChartData>) {
    this.chartOptions.series = [{
      data: data
    }];
  }

  initGraph() {
    this.chartOptions = {
      series: [
        {
          name: "candle",
          data: this.chartData.slice()
        }
      ],
      chart: {
        height: 300,
        type: "candlestick",
        animations: {
          enabled: true,
          includesDynamicAnimations: {
            speed: 500
          }
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          },
          wick: {
            useFillColor: true
          }
        }
      },
      title: {
        text: "Dollar to Bitcoin",
        align: "center"
      },
      tooltip: {
        enabled: true
      },
      xaxis: {
        type: "category",
        borderColor: '#999',
        labels: {
          formatter: function (val: Date) {
            return moment(val).format("MMM DD HH:mm:ss");
          }
        }
      },
      yaxis: {
        forceNiceScale: true,
        tooltip: {
          enabled: true
        }
      },
    };
  }

  ngOnInit(): void {
    this.initGraph();
  }

  chartUpdate() {
    this.chartService.getChartData().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.data = res.bitcoin
      if (this.values.length !== 4 && this.data) {
        this.values.push(+res.bitcoin);
      } else if (this.values.length === 4) {
        this.chartData.push({
          x: new Date(Date.now()),
          y: this.values
        })
        this.values = [];
      }
      this.updateSeries(this.chartData);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

