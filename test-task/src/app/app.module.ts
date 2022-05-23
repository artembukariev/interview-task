import { NgModule } from '@angular/core';
import {AppComponent} from "./app.component";
import {CandlestickChartComponent} from "./pages/candlestick-chart/candlestick-chart.component";
import {TradeInfoComponent} from "./pages/trade-info/trade-info.component";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {NgApexchartsModule} from "ng-apexcharts";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatNativeDateModule} from "@angular/material/core";




@NgModule({
  declarations: [
    AppComponent,
    CandlestickChartComponent,
    TradeInfoComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgApexchartsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
