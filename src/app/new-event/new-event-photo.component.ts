import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../app.config';
import { User } from '../models/user/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-event-photo',
  templateUrl: './new-event-photo.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventPhotoComponent implements OnInit {

  user: User;
  isVisitor: boolean;
  eventId: string;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }

    if(this.authService.isAdmin()) {
      this.router.navigateByUrl('');
    }

    this.user = this.authService.userValue;
    this.isVisitor = this.user.isVisitor;

    if (this.isVisitor) {
      this.router.navigateByUrl('');
    }

    this.eventId = window.location.pathname.split("/").pop();
  }

  setPhoto() {
    let urlFirstPart = `/events/${this.user.username}/updateCoverPhoto/${this.eventId}`;
    let f = (<HTMLFormElement>document.getElementById('photoForm'));

    if ((<HTMLInputElement>document.getElementById('file')).files.length == 0) {
      return;
    }

    f.action = AppConfig.BASE_URL + urlFirstPart;

    setTimeout(() => {
      this.router.navigateByUrl('myEvents');
    }, 1000);

    f.submit();
  }

  noPhoto() {
    this.router.navigateByUrl('myEvents');
  }

}
