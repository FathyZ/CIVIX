import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we're in a browser environment
  if (isPlatformBrowser(platformId)) {
    if (localStorage.getItem('_token') !== null) {
      return true;
    } else {
      _Router.navigate(['/login']);
      return false;
    }
  } else {
    // On server, we can't check localStorage, so redirect to login
    // This will be re-evaluated on the client side
    return false;
  }
};
