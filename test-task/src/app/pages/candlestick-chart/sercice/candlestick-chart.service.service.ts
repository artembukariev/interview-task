import {Injectable} from '@angular/core';
import {Observable, of, Subject} from "rxjs";
import {concatMap, delay} from "rxjs/operators";
import {webSocket} from "rxjs/webSocket";
import {LongTrade, ShortTrade} from "../../trade-info/trade-info.component";

export interface TradeExit {
  'exit_date': Date,
  'exit_price': number,
}

export interface TradeStart {
  'entry_price': number,
  'currency_amount': number,
  'entryDate': Date,
}

@Injectable({
  providedIn: 'root'
})

export class CandlestickChartService {
  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin');
  entryDate: Date;
  entryBalance = new Subject<number>();
  exit_date: Date;
  exit_price: number;
  currency_amount: number;
  tradeInfoStart: TradeStart;
  tradeInfoExit: TradeExit;
  data: any;
  rate: any;

  constructor() {
  }

  getChartData(): Observable<any> {
    this.rate = this.subject.pipe(
      concatMap(item => of(item).pipe(delay(1000)))
    ).subscribe(data => {
      this.rate = data;
      this.subject.next(this.rate.bitcoin);
    })
    return this.subject as Observable<any>;
  }

  shortTrade(entryValue: number, tradeStatus: boolean): Observable<ShortTrade> {
    if (!tradeStatus) {
      this.tradeInfoExit = {
        exit_date: new Date(),
        exit_price: this.rate.bitcoin,
      }
    } else {
      this.tradeInfoStart = {
        entry_price: this.rate.bitcoin,
        currency_amount: (+entryValue / +this.rate.bitcoin),
        entryDate: new Date(),
      }
    }
    return of(tradeStatus ? this.tradeInfoStart : {...this.tradeInfoStart, ...this.tradeInfoExit}) as Observable<any>
  }

  longTrade(entryValue: any, tradeStatus?: boolean): Observable<LongTrade> {
    if (!tradeStatus || new Date() === entryValue.end) {
      this.entryBalance.complete()
    } else {
      this.subject.subscribe((res: any) => {
        const balance = (((+entryValue.enter_balance) / +res.bitcoin) + res.bitcoin)
        this.entryBalance.next(balance);
      })
    }
    return this.entryBalance as Observable<any>;
  }
}
