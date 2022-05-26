import {Injectable} from '@angular/core';
import {Observable, of, Subject, Subscription} from "rxjs";
import {concatMap, delay} from "rxjs/operators";
import {webSocket} from "rxjs/webSocket";
import {TradeValues} from "../../trade-info/trade-info.component";

export interface TradeResult {
  'exit_date': Date,
  'exit_price': number,
  'enter_price': number,
  'enter_value': string,
  'currency_amount': number,
  'enter_date': Date,
  'current_value': Subject<number>
}

export interface BitcoinRate {
  'bitcoin': string;
}


@Injectable({
  providedIn: 'root'
})

export class CandlestickChartService {
  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin');
  entryDate: Date;
  entryBalance = new Subject<number>();
  data: BitcoinRate;
  currentBitcoinValue: BitcoinRate;
  rate: Subscription;

  constructor() {
  }

  getChartData(): Observable<BitcoinRate> {
    this.rate = this.subject.pipe(
      concatMap(item => of(item).pipe(delay(1000)))
    ).subscribe(data => {
      this.data = data as BitcoinRate;
      this.subject.next(this.data.bitcoin);
    })
    return this.subject as Observable<BitcoinRate>;
  }

  result(values: TradeValues): Observable<TradeResult> {
    this.subject.subscribe(res => {
      this.currentBitcoinValue = res as BitcoinRate
      const balance = (((values.enter_price) / +this.currentBitcoinValue.bitcoin))
      this.entryBalance.next(balance);
      if (values.exit_date === new Date() || +values.exit_price >= +this.currentBitcoinValue.bitcoin) {
        this.entryBalance.complete()
      }
    })
    const result = {
      enter_date: values.enter_date,
      exit_date: values.exit_date,
      enter_price: values.enter_price,
      exit_price: values.exit_price,
      currency_amount: (+values?.enter_price / +this.data.bitcoin),
      current_value: this.entryBalance,
      enter_value: this.data.bitcoin,
    }
    return of(result) as Observable<TradeResult>
  }

  closeTrade(isTradeClosed: boolean) {
    if (isTradeClosed) {
      this.entryBalance.complete()
    }
  }
}
