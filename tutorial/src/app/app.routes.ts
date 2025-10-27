import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { LoginComponent } from './user/login.component';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page',
        canActivate: [authGuard]
    },
    {
        path: 'details/:id',
        component: Details,
        title: 'Home Details',
        canActivate: [authGuard]    
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login Page',
    }

];
