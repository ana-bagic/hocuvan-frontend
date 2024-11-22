import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './auth/signup-component/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login-component/login.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { HeadroomModule } from "@ctrl/ngx-headroom";// for removing header on certain amount of scroll todo?
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EventPageComponent } from './event-page/event-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountComponent } from './account/account.component';
import { SignupFavsComponent } from './signup-favs/signup-favs.component';
import { FavEventsComponent } from './fav-events/fav-events.component';
import { ChatComponent } from './chat/chat.component';
import { NewEventComponent } from './new-event/new-event.component';
import { NewEventPhotoComponent } from './new-event/new-event-photo.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { SidenavService } from './services/side-nav.service';
import { EventsComponent } from './events/events.component';
import { FooterComponent } from './footer/footer.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserPageComponent } from './user-page/user-page.component';
import { SearchUsersComponent } from './search-users/search-users.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    EventPageComponent,
    PageNotFoundComponent,
    AccountComponent,
    SignupFavsComponent,
    FavEventsComponent,
    ChatComponent,
    NewEventComponent,
    NewEventPhotoComponent,
    SideNavComponent,
    EventsComponent,
    FooterComponent,
    SearchBarComponent,
    UserPageComponent,
    SearchUsersComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatCardModule,
    HeadroomModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers: [SidenavService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
