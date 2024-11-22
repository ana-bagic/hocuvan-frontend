import { Component, OnInit, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HVEvent } from '../models/event/event';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})


export class SearchBarComponent implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<HVEvent[]>;
  allEvents: HVEvent[];
  noResults: boolean = true;
  searchOpened: boolean = false;
  isSmallScreen: boolean = false;
  @ViewChild('searchIcon') searchIcon: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;



  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.searchInput.nativeElement.contains(event.target)) {
      this.searchOpened = false;
    }
  }

  constructor(
    public searchService: SearchService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    this.allEvents = [];

    this.searchService.getAllEvents()
      .subscribe(events => {
        this.allEvents = events;


      });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );


  }


  private _filter(value: string): HVEvent[] {

    var filteredEvents = []
    const filterValue = value.toLowerCase();
    filteredEvents = this.allEvents.filter(option => option.eventName.toLowerCase().includes(filterValue));
    if (filteredEvents.length == 0 && value.length > 0) {
      this.noResults = true;
    } else this.noResults = false;
    return filteredEvents;
  }

  goToEvent(value) {

    if (value != -1) {
      this.router.navigateByUrl('/event/' + value);
      this.myControl.setValue("")
    }
  }

  openSearch() {

    this.searchOpened = true;

  }
}


