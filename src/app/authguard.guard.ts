import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

type CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;




export const authguardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const isAuthenticated = localStorage.getItem('userId') ? true : false;
  return isAuthenticated;
};
