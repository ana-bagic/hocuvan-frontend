import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Chat } from '../models/chat';
import { Message } from '../models/message';
import { User } from '../models/user/user';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatId: string;
  hasChats: boolean;
  chats: Chat[] = [];
  allChats: Chat[] = [];
  messagesCurrentChat: Message[] = [];
  newMessage: FormGroup;
  user: User;
  searchChatsForm: FormGroup;
  isVisitor: boolean;

  constructor(private chatService: ChatService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('');
    }

    if (this.authService.isAdmin()) {
      this.router.navigateByUrl('');
    }

    this.chatId = window.location.pathname.split("/").pop();
    this.hasChats = this.chatId !== "messages";
    this.user = this.authService.userValue;
    this.isVisitor = this.user.isVisitor;

    if (this.hasChats) {
      this.authService.getPhoto(this.user)
        .subscribe(photo => {
          if (photo.image !== null) {
            this.user.profilePhoto = photo.image;
          }
        })

      this.chatService.getAllChatsForUser()
        .subscribe(ch => {
          this.allChats = ch

          this.allChats.forEach(c => {
            var user = new User();
            user.username = c.otherUsername;
            user.isVisitor = !this.user.isVisitor;

            this.authService.getPhoto(user)
              .subscribe(photo => {
                if (photo.image !== null) {
                  c.otherPhoto = photo.image;
                }

                this.chats.push(c);
              });
          });
        });

      this.newMessage = this.formBuilder.group({
        message: ['']
      });

      this.searchChatsForm = this.formBuilder.group({
        filter: ['']
      });

      this.changedChat(this.chatId);

      this.chatService.newMessage.subscribe((message: Message) => {
        console.log(message);
        if(this.user.username !== message.sender) {
          this.messagesCurrentChat.push(message);
        }
      })
    }

  }

  searchChats() {
    let filter = this.searchChatsForm.get('filter').value;
    this.chats = [];

    if ((<string>filter).length != 0) {
      this.allChats.forEach(c => {
        if (c.otherUsername.includes(filter))
          this.chats.push(c);
      });
    } else {
      this.chats = this.allChats;
    }
  }

  changedChat(chatId) {
    if (window.history.replaceState) {
      window.history.replaceState({}, "", `/messages/${chatId}`);
    }
    this.messagesCurrentChat = [];

    this.chatId = chatId;
    this.chatService.initializeWebSocketConnection(chatId);

    this.chatService.getAllMessagesForChat(chatId)
      .subscribe(m => {
        if (m != null) {
          this.messagesCurrentChat = m;
          console.log(m);
        }
      });
  }

  getImgChat(chat: Chat): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(chat.otherPhoto !== undefined ?
      `data:image/png;base64, ${chat.otherPhoto}` : "/assets/dipsy.png");
  }

  getImgMessage(username: String): SafeUrl {
    let ret;

    if (username == this.user.username) {
      ret = this.sanitizer.bypassSecurityTrustUrl(this.user.profilePhoto !== undefined ?
        `data:image/png;base64, ${this.user.profilePhoto}` : "/assets/dipsy.png");
    } else {
      this.chats.forEach(c => {
        if (c.otherUsername === username) {
          ret = this.sanitizer.bypassSecurityTrustUrl(c.otherPhoto !== undefined ?
            `data:image/png;base64, ${c.otherPhoto}` : "/assets/dipsy.png");
        }
      });
    }

    return ret;
  }

  sendMessage() {
    let mess = this.newMessage.get('message').value;
    this.newMessage.setValue({ message: '' });

    if (mess) {
      let message = new Message();
      message.text = mess;
      message.sender = this.user.username;

      this.messagesCurrentChat.push(message);
      this.chats.forEach(c => {
        if (c.chatId == this.chatId)
          c.lastMessage = mess;
      });

      this.chatService.getChatById(this.chatId)
        .subscribe(chat => {
          message.receiver = chat.otherUsername
          //console.log(message.text + " " + message.sender + " " + message.receiver);
          this.chatService.sendMessage(message, this.chatId);
        });
    }
  }

}
