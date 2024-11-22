import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user/user';
import { AppConfig } from '../app.config';
import { SearchService } from '../services/search.service';
import { CategoriesService } from '../services/category-service';
import { CategoryCard } from '../models/categoryCard';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {

  user: User;
  isVisitor: boolean; // true - visitor, false - organizer
  form0: FormGroup;
  form1: FormGroup;
  submitted: boolean;
  errorUpdateMsg: string;
  loadingUpdate: boolean;
  successUpdateMsg: string;
  errorDeleteMsg: string;
  loadingDelete: boolean;
  hasProfilePhoto: boolean;
  userCats: CategoryCard[];
  categories: CategoryCard[] = [];

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }

    if(this.authService.isAdmin()) {
      this.router.navigateByUrl('');
    }

    this.user = this.authService.userValue;
    this.isVisitor = this.user.isVisitor;
    this.hasProfilePhoto = (this.user.profilePhoto !== undefined && this.user.profilePhoto !== null);

    this.form0 = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.form1 = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
      headquarters: ['', Validators.required],
      orgName: ['', Validators.required]
    });

    if (!this.hasProfilePhoto) {
      this.authService.getPhoto(this.user)
        .subscribe(photo => {
          this.hasProfilePhoto = photo.image !== null;

          if (this.hasProfilePhoto) {
            this.user.profilePhoto = photo.image;
            this.authService.saveUser(this.user);

            setTimeout(() => {
              let i = <HTMLImageElement>document.getElementById('profilePhoto');
              console.log(i);
              i.src = `data:image/png;base64, ${this.user.profilePhoto}`;
            });
          }
        });
    } else {
      setTimeout(() => {
        let i = <HTMLImageElement>document.getElementById('profilePhoto');
        i.src = `data:image/png;base64, ${this.user.profilePhoto}`;
      });
    }

    if(this.isVisitor) {
      this.categoriesService.getFavouriteCategoriesForUser()
      .subscribe(catsUser => {
        this.userCats = catsUser
        this.searchService.getCategories()
          .subscribe(cats => {
            cats.forEach(c => {
              c.isClicked = this.isCatClicked(c.categoryId);
              this.categories.push({ categoryId: c.categoryId, categoryName: c.categoryName, isClicked: c.isClicked });
            });

            this.categories.forEach(c => console.log(c.categoryName + " " + c.isClicked));
          });
        
        
      });
    }
  }

  isCatClicked(catId): boolean {
    var ret = false;

    this.userCats.forEach(c => {
      if (c.categoryId == catId)
        ret = true;
    });

    return ret;
  }

  save() {
    this.submitted = true;

    if (this.isVisitor && this.form0.invalid) {
      return;
    }
    if (!this.isVisitor && this.form1.invalid) {
      return;
    }
    this.errorUpdateMsg = "";
    this.successUpdateMsg = "";
    this.loadingUpdate = true;

    this.authService.update(this.user)
      .pipe(first())
      .subscribe({
        next: (user) => {
          console.log("Saved " + user);
          this.loadingUpdate = false;
          this.successUpdateMsg = "Promjene su uspješno spremljene";
        },
        error: error => {
          console.log("Update err : " + error.message);
          this.loadingUpdate = false;
          this.errorUpdateMsg = error.message === "" ? "Spremanje podataka nije uspjelo" : error.message;
        }
      });
  }

  delete() {
    if (confirm("Jeste li sigurni da želite izbrisati račun?")) {
      this.errorDeleteMsg = "";
      this.loadingDelete = true;

      this.authService.delete(this.user)
        .pipe(first())
        .subscribe({
          next: () => {
            console.log("Deleted");
            this.loadingDelete = false;
            this.router.navigateByUrl('/login');
          },
          error: error => {
            console.log("Delete err : " + error.message);
            this.loadingDelete = false;
            this.errorDeleteMsg = error.message === "" ? "Brisanje računa nije uspjelo" : error.message;
          }
        });
    }
  }

  setPhoto() {
    let urlFirstPart = (this.isVisitor ? "/visitor/" : "/organizer/")
      + this.user.username + "/updateProfilePhoto";
    let f = (<HTMLFormElement>document.getElementById('photoForm'));

    if ((<HTMLInputElement>document.getElementById('file')).files.length == 0) {
      return;
    }

    f.action = AppConfig.BASE_URL + urlFirstPart;

    setTimeout(() => {
      window.location.reload();
    }, 1500);

    f.submit();
  }

  saveCategories() {
    var selected = [];
    this.categories.forEach(cat => {
      if (cat.isClicked) selected.push(cat);
    });

    console.log(selected);

    if (selected.length > 0) {
    this.categoriesService.deleteAllCategoriesForUser()
      .subscribe(m => {
          this.categoriesService.setFavouriteCategories(selected)
            .subscribe(m => window.location.reload());
      });
    }
  }

  // getteri komponenata forme
  get f0() {
    return this.form0.controls;
  }
  get f1() {
    return this.form1.controls;
  }

}
