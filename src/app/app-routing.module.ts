import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExecutiveScreenComponent } from './components/executive-screen/executive-screen.component';
import {PlaybookComponent} from './components/playbook/playbook.component';
import { FeatureDescriptionComponent } from './components/feature-description/feature-description.component';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import {AnalyzeComponent} from './components/analyze/analyze.component';
import {ScanComponent} from './components/scan/scan.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'executive-screen',
        component: ExecutiveScreenComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'playbook',
        component: PlaybookComponent
      },
      {
        path: 'help',
        component: HelpComponent
      }
      ,
      {
        path: 'analyze',
        component: AnalyzeComponent
      }
      ,
      {
        path: 'scan',
        component: ScanComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
