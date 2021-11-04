import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    children: [
      { path: '**', component: LoginComponent },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class AuthRoutingModule { }
