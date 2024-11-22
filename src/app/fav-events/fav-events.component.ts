import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HVEvent } from '../models/event/event';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-fav-events',
  templateUrl: './fav-events.component.html',
  styleUrls: ['./fav-events.component.css']
})

export class FavEventsComponent implements OnInit {

  favEvents: HVEvent[] = [];
  myEvents: HVEvent[] = [];
  isVisitor: boolean;

  constructor(private searchService: SearchService,
    private authService: AuthService,
    private router: Router,
    private eventService: EventService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }
    if (this.authService.isAdmin()) {
      this.router.navigateByUrl('');
    }

    this.isVisitor = this.authService.userValue.isVisitor;
    let urlLast = window.location.pathname.split("/").pop();

    if (this.isVisitor && urlLast === "myEvents") {
      this.router.navigateByUrl('/favEvents');
    }
    if (!this.isVisitor && urlLast === "favEvents") {
      this.router.navigateByUrl('/myEvents');
    }

    if (this.isVisitor) {
      this.searchService.getFavEventsForUser()
        .subscribe(events => {
          this.favEvents = events;

          this.favEvents.forEach(e => {
            this.eventService.getPhoto(e.eventId)
              .subscribe(photo => {
                if (photo.image !== null) {
                  e.coverPhoto = photo.image;
                }
              });
          });

        });
    } else {
      this.searchService.getOrganizerEvents()
        .subscribe(events => {
          this.myEvents = events


          this.myEvents.forEach(e => {
            this.eventService.getPhoto(e.eventId)
              .subscribe(photo => {
                if (photo.image !== null) {
                  e.coverPhoto = photo.image;
                }
              });
          });

        });
    }


  }

  getImg(event: HVEvent): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(event.coverPhoto !== undefined ?
      `data:image/png;base64, ${event.coverPhoto}` : "/assets/defimg.png");
  }

  newEvent() {
    this.router.navigateByUrl('/newEvent');
  }

  edit(eventId) {
    this.router.navigateByUrl(`updateEvent/${eventId}`);
  }

  delete(eventId) {
    if (confirm("Jeste li sigurni da želite izbrisati događaj?")) {
      this.eventService.deleteEvent(eventId)
        .subscribe(() => window.location.reload());
    }
  }
}
