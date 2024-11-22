import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '../models/user/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit {

  allOrganizers: User[] = [];
  allVisitors: User[] = [];
  organizers: User[] = [];
  visitors: User[] = [];
  isAdmin: boolean;
  searchVisitorsForm: FormGroup;
  searchOrganizersForm: FormGroup;

  constructor(private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.authService.getAllOrganizers()
      .subscribe(users => {
        this.allOrganizers = users;

        this.allOrganizers.forEach(o => {
          o.isVisitor = false;

          this.authService.getPhoto(o)
            .subscribe(photo => {
              if (photo.image !== null) {
                o.profilePhoto = photo.image;
              }

              this.organizers.push(o);
            });
        });
      });

    if(this.isAdmin) {
      this.authService.getAllVisitors()
      .subscribe(users => {
        this.allVisitors = users;

        this.allVisitors.forEach(v => {
          v.isVisitor = true;

          this.authService.getPhoto(v)
            .subscribe(photo => {
              if (photo.image !== null) {
                v.profilePhoto = photo.image;
              }

              this.visitors.push(v);
            });
        });
      });
    }

    this.searchVisitorsForm = this.formBuilder.group({
      filter: ['']
    });

    this.searchOrganizersForm = this.formBuilder.group({
      filter: ['']
    });

  }

  searchVisitors() {
    let filter = this.searchVisitorsForm.get('filter').value;
    this.visitors = [];

    if((<string> filter).length != 0) {
      this.allVisitors.forEach(v => {
        if(v.username.includes(filter) || v.firstName.includes(filter) || v.lastName.includes(filter))
          this.visitors.push(v);
      });
    } else {
      this.visitors = this.allVisitors;
    }
  }

  searchOrganizers() {
    let filter = this.searchOrganizersForm.get('filter').value;
    this.organizers = [];

    if((<string> filter).length != 0) {
      this.allOrganizers.forEach(o => {
        if(o.username.includes(filter) || o.orgName.includes(filter))
          this.organizers.push(o);
      });
    } else {
      this.organizers = this.allOrganizers;
    }
  }

  getImg(user: User): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(user.profilePhoto !== undefined ?
      `data:image/png;base64, ${user.profilePhoto}` : "/assets/dipsy.png");
  }

  visitor(user: User) {
    this.router.navigateByUrl(`/visitor/${user.username}`);
  }

  organizer(user: User) {
    this.router.navigateByUrl(`/organizer/${user.username}`);
  }

}
