import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { FireAuthGuard } from './guards/fire-auth.guard';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'sign-in', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [FireAuthGuard] },
  { path: '**', pathMatch: 'full', component: LandingComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
