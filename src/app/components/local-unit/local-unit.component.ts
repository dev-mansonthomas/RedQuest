import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../../services/firestore/firestore.service';
import {CloudFunctionService} from '../../services/cloud-functions/cloud-function.service';
import {ActivatedRoute} from '@angular/router';
import {Queteur} from '../../model/queteur';
import {ULDetails} from '../../model/ULDetails';

@Component({
    selector: 'app-local-unit',
    templateUrl: './local-unit.component.html',
    styleUrls: ['./local-unit.component.css']
})
export class LocalUnitComponent implements OnInit {

    ulDetails: ULDetails;

    constructor(private firestoreService: FirestoreService,
        private functionsService: CloudFunctionService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { queteur: Queteur }) => {
            this.functionsService.findULDetailsByToken(data.queteur.ul_registration_token).subscribe(
                ulDetails => this.ulDetails = ulDetails);
        });
    }

}
