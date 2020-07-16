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
            version: '7.2',
            image: 'assets/angular.png'
        },
        {
            name: 'typescript',
            version: '3.2',
            image: 'assets/ts.png'
        },
        {
            name: 'Firebase',
            version: '5.11',
            image: 'assets/firebase.png'
        },
        {
            name: 'Google Cloud Platform',
            image: 'assets/google_cloud.png'
        },
        {
            name: 'Hammer.js',
            version: '2.0',
            image: 'assets/hammerjs.png'
        },
        {
            name: 'momentjs',
            version: '2.24',
            image: 'assets/momentjs.svg'
        },
        {
            name: 'rxjs',
            version: '6.4',
            image: 'assets/rxjs.png'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
