import { Route } from '@angular/router';

import { PasswordResetInitComponent } from './password-reset-init.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';

export const passwordResetInitRoute: Route = {
    path: 'reset/request',
    component: PasswordResetInitComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.account.password'
    },
    canActivate: [UserRouteAccessService]
};
