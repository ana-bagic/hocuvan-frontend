import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HVEvent } from '../models/event/event';
import { EventService } from '../services/event.service';
import { Review } from '../models/review';
import { User } from '../models/user/user';
import { AuthService } from '../services/auth.service';
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
import { getMatIconNameNotFoundError } from '@angular/material/icon';
import { EventLocation } from '../models/event/event-location';
import { ReviewService } from '../services/review.service';
import { Reply } from '../models/reply';


@Component({
  selector: '/event/:eventId',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

  eventName: String;
  map;
  eventId: string;
  event: HVEvent = new HVEvent();
  location: EventLocation;
  isLoggedIn: boolean;
  isVisitor: boolean;
  visitors: User[] = [];
  free: boolean = false;
  others: Number;
  selected: boolean;
  reviews: Review[] = [];
  myReview: Review = new Review();
  readonly visitorsList = 5;  //max displayed number of attending visitors
  errorDeleteMsg: string;
  loadingDelete: boolean;
  active: String;
  myEvent: Boolean = false;
  reviewId: String;
  reply: Reply = new Reply();
  edit: Boolean = false;
  submitted: Boolean = false;
  successPost: String;


  constructor(private eventService: EventService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.isVisitor = this.authService.userValue.isVisitor
    };

    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.eventService.getEventById(this.eventId).subscribe(event => {
      this.event = event;
      if (this.event.price == 0)
        this.free = true;

      this.eventService.getPhoto(this.eventId)
        .subscribe(photo => {
          if (photo.image !== null) {
            this.event.coverPhoto = photo.image;

            setTimeout(() => {
              let i = <HTMLImageElement>document.getElementById('coverPhoto');
              console.log(i);
              i.src = `data:image/png;base64, ${this.event.coverPhoto}`;
            });
          }
        });

        if(this.isLoggedIn && !this.isVisitor) {
          if(this.authService.userValue.orgName === this.event.orgName)
            this.myEvent = true;
        }
    });

    if (this.isLoggedIn) {
      this.eventService.showEventsVisitors(this.eventId).subscribe(visitors => {
        this.visitors = visitors;

        if (this.visitors.some(visitor => visitor.id == this.authService.userValue.id)) {
          this.selected = true;
        }

        if (visitors.length > this.visitorsList) {
          this.others = this.visitors.length - this.visitorsList;
          this.visitors = this.visitors.slice(0, this.visitorsList);
        }
      });

      this.reviewService.getAllReviewsOfEvent(this.eventId).subscribe(reviews => {
        this.reviews = reviews;

        this.myReview = this.reviews.find(review => review.visitorUsername === this.authService.userValue.username);
        if(this.myReview === undefined){
          this.myReview = new Review();
        }
        else
          this.submitted = true;
      })
    }

    this.initilizeMap();
  }

  public toggleSelected() {
    this.selected = !this.selected;

    if (this.selected) {
      this.eventService.selectImComing(this.eventId).subscribe(
        response => console.log(response.reply)
      )
    } else {
      this.eventService.deselectImComing(this.eventId).subscribe(
        response => console.log(response.reply)
      )
    }
  }

  canDelete() {
    var ret = false;

    if(this.isLoggedIn) {
      if(this.authService.isAdmin()) {
        ret = true;
      } else if(!this.isVisitor && this.event.organizerUsername === this.authService.userValue.username) {
        ret = true;
      }
    }

    return ret;
  }

  delete() {
    if (confirm("Jeste li sigurni da želite izbrisati događaj?")) {
      this.errorDeleteMsg = "";
      this.loadingDelete = true;

      this.eventService.deleteEvent(this.eventId)
        .subscribe(() => this.router.navigateByUrl(''));
    }
  }
  
  submit() {
    this.reviewService.createReview(this.myReview, this.eventId).subscribe(
      review => console.log(review)
    )
    this.submitted = true;
    this.myReview.visitorUsername = this.authService.userValue.username;
    this.myReview.date = new Date();
    this.reviews.push(this.myReview);
  }

  show() {
    this.submitted = false;
  }

  editReview() {
    this.reviewService.updateReview(this.myReview, this.myReview.reviewId).subscribe();
  }

  showInput(reviewId) {
    this.active = reviewId;
    this.reply.reply = "";
    this.edit = false;
  }

  sendReply(reviewId) {
    this.reviewService.replyToReview(reviewId, this.reply).subscribe(
      reply => console.log(reply)
    );
    this.active = "";
    let review = this.reviews.find(review => review.reviewId === reviewId);
    review.reply = this.reply.reply;
  }

  editReply(reviewId) {
    this.reviewService.updateReply(this.reply, reviewId).subscribe();
    this.edit = false;
    this.active="";
    let review = this.reviews.find(review => review.reviewId === reviewId);
    review.reply = this.reply.reply;
  }

  showEdit(reviewId) {
    this.reply.reply = this.reviews.find(review => review.reviewId === reviewId).reply;
    this.active = reviewId;
    this.edit = true;
  }

  deleteReview(reviewId) {
    this.reviewService.deleteReview(reviewId).subscribe();
    let deleted = this.reviews.find(review => review.reviewId === reviewId);
    this.reviews = this.reviews.filter(review => review != deleted);
  }

  canDeleteReview(visitorUsername) {
    var ret = false;

    if(this.isLoggedIn) {
      if(this.authService.isAdmin()) {
        ret = true;
      } else if(this.isVisitor && visitorUsername ===  this.myReview.visitorUsername) {
        ret = true;
      }
    }

    return ret;
  }




  initilizeMap() {
    this.eventService.getEventLocation(this.eventId).subscribe(
      location => {
        this.location = location;

        this.map = new Map({
          target: 'map',
          layers: [
            new Tile({
              source: new OSM(),
              visible: true
            })],
          view: new View({
            center: olProj.fromLonLat([this.location.longitude, this.location.latitude]),
            zoom: 13,
            maxZoom: 18,
            minZoom: 12
          })
        });
    
        var eventMarker = new Feature({
          geometry: new Point(olProj.fromLonLat([this.location.longitude, this.location.latitude]))
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
    );
  }
}
