import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime-ex';

import { TimePipe } from './pipes/time.pipe';
import { WeightPipe } from './pipes/weight.pipe';

const MatModules = [
  MatTabsModule, MatInputModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule,
  MatToolbarModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatOptionModule,
  MatMenuModule, MatProgressBarModule, MatCardModule, MatDividerModule, MatDialogModule,
  MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatTooltipModule,
  MatStepperModule, MatExpansionModule, MatChipsModule, MatGridListModule, MatListModule];

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
