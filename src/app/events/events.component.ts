import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HVEvent } from '../models/event/event';
import { EventLocation } from '../models/event/event-location';
import { EventFilter } from '../models/event/event-search';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { SearchService } from '../services/search.service';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import Tile from 'ol/layer/Tile';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/VectorImage';
import Style from 'ol/style/Style';
@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {


  events: HVEvent[];
  filter: EventFilter;
  locations: String[];
  todaysEventsLocation: EventLocation;
  map;
  page: Number;

  constructor(private searchService: SearchService,
    private authService: AuthService,
    private router: Router,
    private eventService: EventService,
    private sanitizer: DomSanitizer) { }


  ngOnInit(): void {

    this.filter = new EventFilter;

    this.searchService.getAllEvents()
      .subscribe(events => {
        this.events = events
        console.log(events.length)

        this.events.forEach(e => {
          this.eventService.getPhoto(e.eventId)
            .subscribe(photo => {
              if (photo.image !== null) {
                e.coverPhoto = photo.image;
              }
            });
        });
      })

    this.searchService.getLocations()
      .subscribe(locations => this.locations = locations)

    this.initilizeMap();
  }

  getImg(event: HVEvent): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(event.coverPhoto !== undefined ?
      `data:image/png;base64, ${event.coverPhoto}` : "/assets/defimg.png");
  }


  delete(eventId) {
    if (confirm("Jeste li sigurni da želite izbrisati događaj?")) {
      this.eventService.deleteEvent(eventId)
        .subscribe(() => window.location.reload());
    }
  }



  initilizeMap() {

    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM(),
          visible: true
        })],
      view: new View({
        center: olProj.fromLonLat([15.988290, 45.771100]),
        zoom: 13,
        maxZoom: 18,
        minZoom: 12
      })
    });

    var eventMarker = new Feature({
      geometry: new Point(olProj.fromLonLat([15.988290, 45.771100]))
    })

    eventMarker.setStyle(new Style({
      image: new Circle({
        fill: new Fill({
          color: [200, 0, 255, 1]
        }),
        radius: 10,
      })
    }))

    var vectorSource = new VectorSource({
      features: [eventMarker]
    });

    var vectorLayer = new VectorLayer({
      source: vectorSource,
      visible: true
    });

    this.map.addLayer(vectorLayer);
  }
}





