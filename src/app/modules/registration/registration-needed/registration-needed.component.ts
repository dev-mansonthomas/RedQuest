import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QueteurService } from 'src/app/services/queteur/queteur.service';

@Component({
  selector: 'app-registration-needed',
  templateUrl: './registration-needed.component.html'
})
export class RegistrationNeededComponent implements OnInit {

  constructor(private queteurService: QueteurService, private router: Router) { }

  ngOnInit() {
    this.queteurService.getQueteur()
      .then(() => this.router.navigateByUrl(''))
      .catch(() => {
      });
  }

}
