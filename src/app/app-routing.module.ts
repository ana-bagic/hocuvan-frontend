import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './auth/login-component/login.component';
import { SignupComponent } from './auth/signup-component/signup.component';
import { HomeComponent } from './home/home.component';
import { EventPageComponent } from './event-page/event-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupFavsComponent } from './signup-favs/signup-favs.component'
import { FavEventsComponent } from './fav-events/fav-events.component';
import { ChatComponent } from './chat/chat.component';
import { NewEventComponent } from './new-event/new-event.component';
import { NewEventPhotoComponent } from './new-event/new-event-photo.component';
import { EventsComponent } from './events/events.component';
import { UserPageComponent } from './user-page/user-page.component';
import { SearchUsersComponent } from './search-users/search-users.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, //default route
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'event/:eventId', component: EventPageComponent },
  { path: 'account', component: AccountComponent },
  { path: 'favEvents', component: FavEventsComponent },
  { path: 'myEvents', component: FavEventsComponent },
  { path: 'newEvent', component: NewEventComponent },
  { path: 'updateEvent/:eventId', component: NewEventComponent },
  { path: 'event/updatePhoto/:eventId', component: NewEventPhotoComponent },
  { path: 'messages', component: ChatComponent },
  { path: 'messages/:chatId', component: ChatComponent },
  { path: 'signup/favorites', component: SignupFavsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'visitor/:username', component: UserPageComponent },
  { path: 'organizer/:username', component: UserPageComponent },
  { path: 'organizers', component: SearchUsersComponent },
  { path: 'users', component: SearchUsersComponent },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})


export class AppRoutingModule { }
