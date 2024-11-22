import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Message } from '../models/message';
import { User } from '../models/user/user';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user: User = new User();
  isVisitor: boolean; // true - visitor, false - organizer
  errorDeleteMsg: string;
  loadingDelete: boolean;
  loadingSend: boolean;
  isCurrentAdmin: boolean;
  isCurrentVisitor: boolean;
  isLoggedIn: boolean;
  newMessage: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let urlSplit = window.location.pathname.split("/");
    let urlUsername = urlSplit.pop();
    let urlTypeOfUser = urlSplit.pop();
    this.isVisitor = urlTypeOfUser === "visitor";
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.isCurrentAdmin = this.authService.isAdmin();
      this.isCurrentVisitor = this.authService.userValue.isVisitor;

      if(this.isVisitor && !this.isCurrentAdmin) {
        this.router.navigateByUrl('');
      }
    } else {
      this.isCurrentAdmin = false;
      this.isCurrentVisitor = false;
    }

    if (this.isVisitor) {
      this.authService.getVisitorByUsername(urlUsername)
        .subscribe(user => {
          this.user = user;

          this.authService.getPhoto(this.user)
          .subscribe(photo => {
            if (photo.image !== null) {
              this.user.profilePhoto = photo.image;
            }
          });
        });
    } else {
      this.authService.getOrganizerByUsername(urlUsername)
        .subscribe(user => {
          this.user = user;

          this.authService.getPhoto(this.user)
          .subscribe(photo => {
            if (photo.image !== null) {
              this.user.profilePhoto = photo.image;
            }
          });
        });
    }

    this.newMessage = this.formBuilder.group({
      message: ['']
    });
  }

  getImg(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.user.profilePhoto !== undefined ?
      `data:image/png;base64, ${this.user.profilePhoto}` : "/assets/dipsy.png");
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

  sendMessage() {
    let mess = this.newMessage.get('message').value;
    this.loadingSend = true;

    if(mess) {
      let message = new Message();
      message.text = mess;
      message.sender = this.authService.userValue.username;
      message.receiver = this.user.username;

      this.chatService.getAllChatsForUser()
      .subscribe(chats => {
        var found = false;

        if(chats !== null) {
          chats.forEach(chat => {
            if(chat.otherUsername === this.user.username) {
              found = true;
              this.chatService.initializeWebSocketConnection(chat.chatId);
              setTimeout(() => {
                this.chatService.sendMessage(message, chat.chatId);
                this.router.navigateByUrl(`/messages/${chat.chatId}`);
              }, 750);
            }
          });
        }

        if(!found) {
          this.chatService.createChat(this.user.username)
            .subscribe(chat => {
              this.chatService.initializeWebSocketConnection(chat.chatId);
              setTimeout(() => {
                this.chatService.sendMessage(message, chat.chatId);
                this.router.navigateByUrl(`/messages/${chat.chatId}`);
              }, 750);
            });
        }
      });
    }
  }

}
