import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from './pipes/time.pipe';
import { WeightPipe } from './pipes/weight.pipe';

import {
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule,
  MatOptionModule, MatMenuModule, MatTabsModule, MatInputModule, MatRadioModule,
  MatDatepickerModule, MatNativeDateModule, MatCardModule, MatDividerModule, MatDialogModule,
  MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule,
  MatIconRegistry, MatStepperModule, MatCheckboxModule, MatExpansionModule, MatChipsModule,
  MatGridListModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

const MatModules = [
  MatTabsModule, MatInputModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule,
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatOptionModule,
  MatMenuModule, MatProgressBarModule, MatCardModule, MatDividerModule, MatDialogModule,
  MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckboxModule,
  MatStepperModule, MatExpansionModule, MatChipsModule, MatGridListModule];

@NgModule({
  declarations: [TimePipe, WeightPipe],
  imports: [FormsModule, ReactiveFormsModule, FlexLayoutModule, MatModules,
    OwlDateTimeModule, OwlNativeDateTimeModule],
  exports: [
    FormsModule, ReactiveFormsModule, TimePipe, WeightPipe,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    MatModules, FlexLayoutModule],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' }
  ],
})
export class SharedModule {
  constructor(private matIconRegistry: MatIconRegistry) {
    // Use material Icon as default font for icon
    // register fontawesome as 'fa' for icons (fontSet="fa", fontSet="fa" fontIcon="fa-car")
    //
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
