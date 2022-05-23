import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from "moment";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexTooltip
} from "ng-apexcharts";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {CandlestickChartService} from "./sercice/candlestick-chart.service.service";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
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
  data: any;
  values: Array<number> = [] ;

  chartData = [
    {
      x: new Date(Date.now()),
      y: [30367.46,30367.46,30367.46,30367.46]
    }
  ]

  constructor(private chartService: CandlestickChartService) {
    this.initGraph();
  }

  public updateSeries(data: any) {
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
        height: 500,
        type: "candlestick",
        animations: {
          enabled: true,
          includesDynamicAnimations: {
            speed: 1000
          }
        }
      },
      title: {
        text: "Buy or Cry",
        align: "center"
      },
      tooltip: {
        enabled: true
      },
      xaxis: {
        type: "category",
        borderColor: '#999',

        tickAmount: 2,
        labels: {
          formatter: function (val: Date) {
            return moment(val).format("MMM DD HH:mm:ss");
          }
        }
      },
      yaxis: {
        tickAmount: 2,
        tooltip: {
          enabled: true
        }
      }
    };
  }

  ngOnInit(): void {
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

