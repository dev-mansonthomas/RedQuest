import {Component, NgZone, OnInit} from '@angular/core';
import {QueteurService} from '../../services/queteur/queteur.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration-needed',
  templateUrl: './registration-needed.component.html',
  styleUrls: ['./registration-needed.component.css']
})
export class RegistrationNeededComponent implements OnInit {

  constructor(private queteurService: QueteurService,
              private router: Router) {
  }

  ngOnInit() {
    this.queteurService.getQueteur()
      .then(() => this.router.navigateByUrl('/homepage'))
      .catch(() => {
      });
  }

}
