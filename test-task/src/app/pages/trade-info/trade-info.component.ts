import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {CandlestickChartService, TradeResult} from "../candlestick-chart/sercice/candlestick-chart.service.service";


export interface TradeValues {
  'enter_date': Date,
  'exit_date': Date,
  'enter_price': number,
  'exit_price': number
}

@Component({
  selector: 'app-trade-info',
  templateUrl: './trade-info.component.html',
  styleUrls: ['./trade-info.component.scss']
})
export class TradeInfoComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  tradeResult: TradeResult;
  isEditable: boolean = true;
  currentValue: number;
  profit: number;

  tradeValues = new FormGroup({
    enter_date: new FormControl(new Date(), [Validators.required]),
    exit_date: new FormControl("", [Validators.required]),
    enter_price: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    exit_price: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")])
  });

  constructor(private chartService: CandlestickChartService) {
  }

  ngOnInit(): void {

  }

  submit() {
    if ((this.tradeValues.value.enter_date).getDate() < new Date().getDate()) {
      this.tradeValues.controls['enter_date'].setErrors({'incorrect': true});
    } else {
      this.tradeValues.controls['enter_date'].setErrors(null);
    }
    if (this.tradeValues.valid) {
      this.isEditable = false
      this.disableForm(this.isEditable);
      this.chartService.result(this.tradeValues.value).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.tradeResult = res
        this.tradeResult.current_value.pipe(takeUntil(this.destroy$)).subscribe(currentValue => {
          this.currentValue = currentValue;
          if (this.currentValue && this.tradeResult.currency_amount) {
            this.profit = this.tradeResult.currency_amount - this.currentValue;
          }
        });
      })
    }
  }

  disableForm(isEditable: boolean) {
    if (!isEditable) {
      this.tradeValues.disable()
    }
  }

  editValue() {
    this.tradeValues.enable()
    this.isEditable = true
  }

  closeTrade() {
    this.chartService.closeTrade(true)
    this.editValue();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
