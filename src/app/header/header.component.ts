import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Chat } from '../models/chat';
import { User } from '../models/user/user';
import { ChatService } from '../services/chat.service';
import { SidenavService } from '../services/side-nav.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {

  isLoggedIn: boolean;
  user: User;
  isVisitor: boolean;
  chats: Chat[];


  constructor(private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    public sideNavService: SidenavService,
  ) { }

  ngOnInit() {
    this.authService.loggedIn.subscribe((data: boolean) => {
      this.isLoggedIn = data

      if (this.isLoggedIn) {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.isVisitor = this.user.isVisitor;
      }
    });
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.isVisitor = this.user.isVisitor;
    }
    console.log(this.isLoggedIn)




  }




  //when size of screen changes...
  onResize(event?) {
    var width;
    if (event == null) { width = window.innerWidth; }
    else width = event.target.innerWidth;
    switch (true) {
      case (width < 700):

    }

  }

  account() {
    this.router.navigateByUrl('/account');
  }

  favEvents() {
    this.router.navigateByUrl('/favEvents');
  }

  myEvents() {
    this.router.navigateByUrl('/myEvents');
  }

  chat() {
    this.chatService.getAllChatsForUser()
      .subscribe(ch => {
        this.chats = ch;
        this.router.navigateByUrl(`/messages` + (this.chats != null ? `/${this.chats[0].chatId}` : ``));
      });
  }

  toggleSideNav() {

    this.sideNavService.toggle();

  }

}
