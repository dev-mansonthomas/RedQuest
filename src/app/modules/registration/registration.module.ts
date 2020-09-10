
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {QueteurResolverService, RegisteredQueteurResolverService} from 'src/app/services/queteur/queteur.service';
import { SharedModule } from 'src/app/shared.module';

import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';
import { RegistrationNeededComponent } from './registration-needed/registration-needed.component';
import { RegistrationStep2Component } from './registration-step-2/registration-step-2.component';
import { RegistrationComponent } from './registration.component';

const ROUTES: Routes = [{
    path: '',
    component: RegistrationComponent
}, {
    path: 'confirmation',
    component: RegistrationConfirmationComponent,
    resolve: { queteur: RegisteredQueteurResolverService }
}, {
    path: 'needed',
    component: RegistrationNeededComponent
}, {
    path: '**', redirectTo: ''
}];

@NgModule({
    imports: [CommonModule, SharedModule, RouterModule.forChild(ROUTES)],
    declarations: [
        RegistrationComponent, RegistrationNeededComponent,
        RegistrationConfirmationComponent, RegistrationStep2Component
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistrationModule { }
