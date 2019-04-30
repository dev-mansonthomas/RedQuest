import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from './pipes/time.pipe';
import { WeightPipe } from './pipes/weight.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


@NgModule({
  declarations: [TimePipe, WeightPipe],
  imports: [FormsModule, ReactiveFormsModule, NgxPaginationModule,
    BsDatepickerModule.forRoot(), TimepickerModule.forRoot()],
  exports: [
    FormsModule, ReactiveFormsModule, TimePipe, WeightPipe,
    NgxPaginationModule, BsDatepickerModule, TimepickerModule
  ]
})
export class SharedModule {
}
