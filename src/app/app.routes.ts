import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecipesComponent } from './recipes/recipes.component';

export const routes: Routes = [
    {
        path: '',
        component: StartPageComponent
    },
    {
        path: 'about',
        component: StartPageComponent
    },
    {
        path: 'services',
        component: StartPageComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'recipes',
        component: RecipesComponent
    }
];
