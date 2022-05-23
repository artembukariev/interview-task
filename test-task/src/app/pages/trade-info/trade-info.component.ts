import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CandlestickChartService} from "../candlestick-chart/sercice/candlestick-chart.service.service";

export interface ShortTrade {
//Todo
}

export interface LongTrade {
//Todo
}
@Component({
  selector: 'app-trade-info',
  templateUrl: './trade-info.component.html',
  styleUrls: ['./trade-info.component.scss']
})
export class TradeInfoComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  openShortTrade: boolean = false;
  openLongTrade: boolean = false;
  shortTrade: any;
  longTrade: any;

  selectValue = new FormGroup({
    enter_bet: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")])
  });

  balanceValue = new FormGroup({
    enter_balance: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    end: new FormControl("", [Validators.required])
  });

  constructor(private chartService: CandlestickChartService) {
  }

  ngOnInit(): void {

  }

  submitTrade() {
    if (this.selectValue.value.enter_bet && this.selectValue.valid) {
      this.openShortTrade = !this.openShortTrade;
      this.chartService.shortTrade(this.selectValue.value.enter_bet, this.openShortTrade).pipe(takeUntil(this.destroy$)).subscribe(res => this.shortTrade = res)
    }
  }

  submitBalanceTrade() {
    if (this.balanceValue.value && this.balanceValue.valid) {
      this.openLongTrade = !this.openLongTrade;
      this.chartService.longTrade(this.balanceValue.value,  this.openLongTrade).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.longTrade = res;
      })
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
