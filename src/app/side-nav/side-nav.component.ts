import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/side-nav.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user/user';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  constructor(private sidenavService: SidenavService,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService) { }

  isLoggedIn: boolean;
  user: User;
  isVisitor: boolean;
  isAdmin: boolean;

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((data: boolean) => {
      this.isLoggedIn = data

      if (this.isLoggedIn) {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.isVisitor = this.user.isVisitor;
        this.isAdmin = this.authService.isAdmin();
      }
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();

    if (this.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.isVisitor = this.user.isVisitor;
    }


  }
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
  toggleDrawer() {

    this.sidenavService.toggle();

  }

  account() {
    this.sidenavService.close();
    this.router.navigateByUrl('/account');

  }

  favEvents() {
    this.sidenavService.close();
    this.router.navigateByUrl('/favEvents');
  }

  myEvents() {
    this.sidenavService.close();
    this.router.navigateByUrl('/myEvents');
  }


  login() {
    this.sidenavService.close();
    this.router.navigateByUrl('/login');
  }

  signup() {
    this.sidenavService.close();
    this.router.navigateByUrl('/signup');
  }

  events() {
    this.sidenavService.close();
    this.router.navigateByUrl('/events');
  }

  chat() {
    this.sidenavService.close();
    this.chatService.getAllChatsForUser()
      .subscribe(ch => {
        this.router.navigateByUrl(`/messages` + (ch != null ? `/${ch[0].chatId}` : ``));
      });
  }

  logout() {
    this.sidenavService.close();
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
  }

  users() {
    if(this.isAdmin) {
      this.router.navigateByUrl('/users');
    } else {
      this.router.navigateByUrl('/organizers');
    }
  }


}
