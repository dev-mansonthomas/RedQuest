
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { RegistrationComponent } from './registration.component';
import { RegistrationNeededComponent } from './registration-needed/registration-needed.component';
import { RegistrationStep2Component } from './registration-step-2/registration-step-2.component';
import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';

const ROUTES: Routes = [
    {
        path: '',
        component: RegistrationComponent
    },
    {
        path: 'confirmation',
        component: RegistrationConfirmationComponent
    },
    {
        path: 'needed',
        component: RegistrationNeededComponent
    },
    {
        path: '**', redirectTo: ''
    }];

@NgModule({
    imports: [
        CommonModule, FormsModule,
        ReactiveFormsModule, RouterModule.forChild(ROUTES)],
    declarations: [
        RegistrationComponent, RegistrationNeededComponent,
        RegistrationConfirmationComponent, RegistrationStep2Component
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistrationModule { }
