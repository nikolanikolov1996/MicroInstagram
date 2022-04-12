import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PhotosComponent } from './photos/photos.component';
import { PhotoDetailComponent } from './photos/photo-detail/photo-detail.component';
import { PhotoEditComponent } from './photos/photo-edit/photo-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    PhotosComponent,
    PhotoDetailComponent,
    PhotoEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    RouterModule.forRoot([
      { path: "home", component: HomeComponent },
      { path: "photos", component: PhotosComponent },
      { path: "photos/detail/:id", component: PhotoDetailComponent },
      { path: "photos/edit/:id", component: PhotoEditComponent },
      { path: "photos/upload", component: PhotoEditComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]),
    JwPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
