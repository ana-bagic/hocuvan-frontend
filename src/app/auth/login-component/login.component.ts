import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  errorMsg: String;


  constructor(private loginService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  // getter komponenti forme
  get f() { return this.form.controls; }



  onSubmit() {  // poziva nakon klika na "Prijava"
    this.submitted = true;


    // stani ako je forma nevažeća
    if (this.form.invalid) {
      return;
    }
    this.errorMsg = "";
    this.loading = true;
    this.loginService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          console.log("Login err : " + error.message);
          this.errorMsg = error.message;
          this.loading = false;
        }
      });
  }


}

