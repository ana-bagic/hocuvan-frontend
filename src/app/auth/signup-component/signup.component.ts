import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MustMatch } from 'src/app/helpers/must-match.validator';


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class SignupComponent implements OnInit {

  user: User = new User();
  form0: FormGroup;
  form1: FormGroup;
  loading = false;
  submitted = false;
  userCreated = false;
  category = 0; // 0 := visitor, 1:= organizer
  hide = true;
  errorMsg: String;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {//TODO pomaknuti u zaseban folder radi čitljivosti koda
    if(this.authService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }

    this.form0 = this.formBuilder.group({
      username: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$')]],

      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.form1 = this.formBuilder.group({
      username: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$')]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
      headquarters: ['', Validators.required],
      orgName: ['', Validators.required],
      password: ['', [Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

  }


  changeCategory(index) { //poziva se mijenjanjem kategorije organizator/korisnik
    this.category = index;
    this.errorMsg = ""
    this.form0.reset();
    this.form1.reset();

  }


  onSubmit() {  // poziva nakon klika na "Registiraj"

    console.log(this.category);
    this.submitted = true;

    // stani ovdje ako je forma nevažeća

    if (this.category == 0 && this.form0.invalid) {
      return;
    }
    if (this.category == 1 && this.form1.invalid) {
      return;
    }
    this.errorMsg = "";
    this.loading = true;
    this.authService.register(this.user, this.category == 0 ? "visitor" : "organizer")
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          console.log("New user registered...");

          alert("Uspješna registracija!");

          if (this.category == 0) { //if visitor
            this.user.isVisitor = true;
            this.router.navigateByUrl('/signup/favorites');
          } else {
            this.user.isVisitor = false;
            const returnUrl = '/'; // return to home page
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: error => {
          console.log("SignUp err : " + error.message);
          this.loading = false;
          this.errorMsg = error.message;
        }
      });


  }


  // getteri komponenata forme
  get f0() {
    return this.form0.controls;
  }
  get f1() {
    return this.form1.controls;
  }

}
