import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsideLinesComponent, KeyComponent, ModalEditorComponent, ModalImageComponent, ModalKeyComponent } from './components';
import { HomeRoutingModule } from './home-routing.module';
import { CreatePDFComponent, HomeComponent } from './pages';

@NgModule({
  declarations: [
    HomeComponent,
    CreatePDFComponent,
    AsideLinesComponent,
    KeyComponent,
    ModalImageComponent,
    ModalEditorComponent,
    ModalKeyComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
