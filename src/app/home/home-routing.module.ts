import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePDFComponent, HomeComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'pdf', component: CreatePDFComponent },
      { path: '**', component: HomeComponent },
      // {
      //   path: '**',
      //   redirectTo: 'home',
      //   pathMatch: 'full'
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
