import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HVEvent } from '../models/event/event';
import { EventService } from '../services/event.service';
import { User } from '../models/user/user';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/VectorImage';
import Style from 'ol/style/Style';
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
import { CategoryCard } from '../models/categoryCard';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  user: User;
  isVisitor: boolean;
  form: FormGroup;
  submitted: boolean;
  errorMsg: string;
  loading: boolean;
  event: HVEvent = new HVEvent();
  categories: CategoryCard[];
  isUpdate: boolean;
  dateString: string;
  map;

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private searchService: SearchService) { }

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

    let urlLast = window.location.pathname.split("/").pop();
    if(urlLast != 'newEvent') {
      this.isUpdate = true;
      this.eventService.getEventById(urlLast)
        .subscribe(event => {
          this.event = event;
          //this.event.date.toISOString
          this.dateString = event.date.toString().slice(0, 16);
        });
    } else {
      this.isUpdate = false;
    }

    this.form = this.formBuilder.group({
      eventName: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      categoryName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      numberOfSeats: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });

    this.searchService.getCategories()
      .subscribe(categories => this.categories = categories);

    this.initilizeMap();
  }

  save() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.errorMsg = "";
    this.loading = true;

    this.event.date = new Date(this.dateString);

    if(this.isUpdate) {
      this.update();
      return;
    }

    this.eventService.createEvent(this.event)
      .pipe(first())
      .subscribe({
        next: (event) => {
          console.log("Created event " + event.eventId);
          this.loading = false;
          this.router.navigateByUrl(`/event/updatePhoto/${event.eventId}`);
        },
        error: error => {
          console.log("Create err : " + error.message);
          this.loading = false;
          this.errorMsg = error.message === "" ? "Kreiranje događaja nije uspjelo" : error.message;
        }
      });
  }

  update() {
    this.eventService.updateEvent(this.event)
    .pipe(first())
    .subscribe({
      next: (event) => {
        console.log("Updated event " + event.eventId);
        this.loading = false;

          this.eventService.getPhoto(event.eventId)
            .subscribe(photo => {
              if (photo.image !== null) {
                this.router.navigateByUrl(`/myEvents`);
              } else {
                this.router.navigateByUrl(`/event/updatePhoto/${event.eventId}`)
              }
            });
      },
      error: error => {
        console.log("Update err : " + error.message);
        this.loading = false;
        this.errorMsg = error.message === "" ? "Spremanje promjena događaja nije uspjelo" : error.message;
      }
    });
  }

  get f() {
    return this.form.controls;
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
