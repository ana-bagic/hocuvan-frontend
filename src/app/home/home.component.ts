import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service'
import { HVEvent } from '../models/event/event';
import { AuthService } from '../services/auth.service';
import { EventFilter } from '../models/event/event-search'
import { NumberSymbol } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { formatDate } from "@angular/common";
import { CategoryCard } from '../models/categoryCard';
import { EventLocation } from '../models/event/event-location';
import { EventService } from '../services/event.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';


@Component({
  selector: '/',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  numOfResults: Number;
  userFiltered: boolean;
  isLoggedIn: boolean;
  searchEvent: HVEvent[];
  todaysEvents: HVEvent[] = [];
  popularEvents: HVEvent[];
  filteredEvents: HVEvent[];
  locations: String[];
  categories: CategoryCard[];
  eventFilter: EventFilter;
  allEvents: HVEvent[];
  isVisitor: boolean;
  todaysEventsLocation: EventLocation;
  page: Number;
  format = 'yyyy-MM-dd';
  locale = 'en-US';



  constructor(private eventService: EventService,
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
  ) { }


  ngOnInit(): void {
    this.numOfResults = 0;
    this.page = 0;
    this.isVisitor = false;
    this.eventFilter = new EventFilter;
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn)
      this.isVisitor = this.authService.userValue.isVisitor;

    this.searchService.getAllEvents()
      .subscribe(events => {
        this.allEvents = events;
        this.filteredEvents = this.allEvents;

        this.filteredEvents.forEach(e => {
          this.eventService.getPhoto(e.eventId)
            .subscribe(photo => {
              if (photo.image !== null) {
                e.coverPhoto = photo.image;
              }
            });
        });
      });


    if (this.isLoggedIn && this.isVisitor)
      this.searchService.getRecommendedEvents()
        .subscribe(events => {
          this.todaysEvents = events;

          this.todaysEvents.forEach(e => {
            this.eventService.getPhoto(e.eventId)
              .subscribe(photo => {
                if (photo.image !== null) {
                  e.coverPhoto = photo.image;
                }
              });
          });
        });

    this.searchService.getPopularEvents()
      .subscribe(events => {
        this.popularEvents = events;

        this.popularEvents.forEach(e => {
          this.eventService.getPhoto(e.eventId)
            .subscribe(photo => {
              if (photo.image !== null) {
                e.coverPhoto = photo.image;
              }
            });
        });
      });

    this.searchService.getCategories()
      .subscribe(categories => this.categories = categories);

    this.searchService.getLocations()
      .subscribe(locations => this.locations = locations)


  }





  filterSelected(selectCategory, value) { //selectCategory 0- location, 1-category, 2-date,  3-price
    this.userFiltered = true;
    switch (selectCategory) {
      case (0): {
        this.eventFilter.organisationHeadquarter = value;
        break;
      }
      case (1): {
        this.eventFilter.categoryName = value;

        break;
      }

      case (2): {
        const formattedDate = formatDate(value, this.format, this.locale);

        this.eventFilter.date = formattedDate;

        break;
      }
      case (3): {
        this.eventFilter.price = value;

        break;
      }
    }
    this.searchService.getFilterdEvents(this.eventFilter)
      .subscribe(events => {
        this.filteredEvents = events
        console.log(events.length)

        this.filteredEvents.forEach(e => {
          this.eventService.getPhoto(e.eventId)
            .subscribe(photo => {
              if (photo.image !== null) {
                e.coverPhoto = photo.image;
              }
            });
        });
      })

  }

  getImg(event: HVEvent): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(event.coverPhoto !== undefined ?
      `data:image/png;base64, ${event.coverPhoto}` : "/assets/defimg.png");
  }

  loadMore() {

    this.searchService.getFilterdEvents(this.eventFilter)

  }


}


