import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-credits',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

    dependences = [
        {
            name: 'Angular',
            version: '10.0',
            image: 'assets/angular.png'
        },
        {
            name: 'typescript',
            version: '3.9',
            image: 'assets/ts.png'
        },
        {
            name: 'Firebase',
            version: '7.17',
            image: 'assets/firebase.png'
        },
        {
            name: 'Google Cloud Platform',
            image: 'assets/google_cloud.png'
        },
        {
            name: 'momentjs',
            version: '2.27',
            image: 'assets/momentjs.svg'
        },
        {
            name: 'rxjs',
            version: '6.6',
            image: 'assets/rxjs.png'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
