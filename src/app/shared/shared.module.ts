import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent, ScrollToTopComponent, TagInputComponent, PaginationComponent, HeaderComponent, FooterComponent } from './components';
import { WebviewDirective, DebounceClickDirective } from './directives';
import { CapitalizePipe, TimeAgoPipe, TitleRoutPipe } from './pipes';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    ScrollToTopComponent,
    TagInputComponent,
    PaginationComponent,
    DebounceClickDirective,
    CapitalizePipe,
    TimeAgoPipe,
    TitleRoutPipe,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    WebviewDirective,
    FormsModule,
    ScrollToTopComponent,
    TagInputComponent,
    PaginationComponent,
    DebounceClickDirective,
    CapitalizePipe,
    TimeAgoPipe,
    TitleRoutPipe,
    HeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
