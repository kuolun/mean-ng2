import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
// custom service
import { Auth } from './auth.service';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { NotFoundComponent } from './not-found.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProfileComponent } from './profile/profile.component';

import 'rxjs/add/operator/map';

const routes: Routes = [
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProductListComponent,
    NotFoundComponent,
    ProductDetailComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [Auth],
  bootstrap: [AppComponent]
})
export class AppModule { }
