import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.hasToken()) {
            //alert('nao token');
            this.router.navigate(['/login']);
            return false;
        }
        return true;

        //esta expirado
        // return this.auth.refresh().pipe(
        //     map(data) => true,
        //     catchError(() => {
        //         this.router.navigate(['/login'])
        //         throwError(false)
        //     })
        // )
    }



    hasToken() {
        return window.localStorage.getItem('token') !== null;
    }
}
