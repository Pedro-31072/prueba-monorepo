import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'appointment',
    loadChildren: () => import('@appointment-calendar/feature').then((r) => r.routes),
  },
  {
    path:"**",
    redirectTo:"appointment"
  }
];
