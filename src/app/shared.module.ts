import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from './pipes/time.pipe';
import { WeightPipe } from './pipes/weight.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import {
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule,
  MatOptionModule, MatMenuModule, MatTabsModule, MatInputModule, MatRadioModule,
  MatDatepickerModule, MatNativeDateModule, MatCardModule, MatDividerModule, MatDialogModule,
  MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule, MatIconRegistry
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

const MatModules = [MatTabsModule, MatInputModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule,
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatMenuModule, MatProgressBarModule,
  MatCardModule, MatDividerModule, MatDialogModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule];
@NgModule({
  declarations: [TimePipe, WeightPipe],
  imports: [FormsModule, ReactiveFormsModule, FlexLayoutModule, MatModules,
    BsDatepickerModule.forRoot(), TimepickerModule.forRoot()],
  exports: [
    FormsModule, ReactiveFormsModule, TimePipe, WeightPipe,
    BsDatepickerModule, TimepickerModule, MatModules, FlexLayoutModule
  ]
})
export class SharedModule {
  constructor(private matIconRegistry: MatIconRegistry) {
    // Use material Icon as default font for icon
    // register fontawesome as 'fa' for icons (fontSet="fa", fontSet="fa" fontIcon="fa-car")
    //
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
