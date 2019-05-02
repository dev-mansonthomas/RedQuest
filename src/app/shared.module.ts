import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from './pipes/time.pipe';
import { WeightPipe } from './pipes/weight.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import {
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule,
  MatOptionModule, MatMenuModule, MatTabsModule, MatInputModule, MatRadioModule,
  MatDatepickerModule, MatNativeDateModule, MatCardModule, MatDividerModule, MatDialogModule, MatIconModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

const MatModules = [MatTabsModule, MatInputModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule,
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatMenuModule,
  MatCardModule, MatDividerModule, MatDialogModule, MatIconModule];
@NgModule({
  declarations: [TimePipe, WeightPipe],
  imports: [FormsModule, ReactiveFormsModule, NgxPaginationModule, FlexLayoutModule, MatModules,
    BsDatepickerModule.forRoot(), TimepickerModule.forRoot()],
  exports: [
    FormsModule, ReactiveFormsModule, TimePipe, WeightPipe,
    NgxPaginationModule, BsDatepickerModule, TimepickerModule, MatModules, FlexLayoutModule
  ]
})
export class SharedModule {
}
