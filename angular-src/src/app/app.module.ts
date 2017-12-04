import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Importans modules from angular
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

// Npm Install Modules
import { FlashMessagesModule } from 'ngx-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { AddFacebookPageTeamComponent } from './components/add-facebook-page-team/add-facebook-page-team.component';
import { AddFacebookPagePersonalComponent } from './components/add-facebook-page-personal/add-facebook-page-personal.component';


import { AuthGuard } from './guards/auth.guards';



import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { SidebarService } from './services/sidebar.service';

const appRoutes: Routes = [
{ path:'', component: HomeComponent, canActivate:[AuthGuard]},
{ path:'register', component: RegisterComponent},
{ path:'login', component: LoginComponent},
{ path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
{ path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
{ path:'inbox/add/facebook-page-team', component: AddFacebookPageTeamComponent, canActivate:[AuthGuard]},
{ path:'inbox/add/facebook-page-personal', component: AddFacebookPagePersonalComponent, canActivate:[AuthGuard]},

]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    SidebarComponent,
    AddFacebookPageTeamComponent,
    AddFacebookPagePersonalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [
    ValidateService,
    AuthService,
    SidebarService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
