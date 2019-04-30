import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {QueteurService} from './services/queteur/queteur.service';

@Injectable({
  providedIn: 'root'
})
export class RegisteredGuard implements CanActivate {

  constructor(private router: Router, private queteurService: QueteurService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.queteurService.getQueteur()
      .then(queteur => {
        if (queteur.registration_approved) {
          return true;
        } else {
          this.router.navigateByUrl('registration/confirmation');
          return true;
        }
      })
      .catch(() => {
        this.router.navigateByUrl('registration/needed');
        return false;
      });
  }
}
