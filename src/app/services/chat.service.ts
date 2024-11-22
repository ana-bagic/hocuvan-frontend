import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AppConfig } from "../app.config";
import { Chat } from "../models/chat";
import { Message } from "../models/message";
import { MessageReceived } from "../models/message-received";
import { AuthService } from "./auth.service";

declare var SockJS;
declare var Stomp;

@Injectable({ providedIn: 'root' })

export class ChatService {

    @Output() newMessage: EventEmitter<Message> = new EventEmitter();

    private baseUrl = AppConfig.BASE_URL
    public stompClient;
    public msg = [];

    constructor(private http: HttpClient,
        private authService: AuthService) { }


    getAllChatsForUser(): Observable<Chat[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.get<Chat[]>(`${this.baseUrl}/${user.username}/allChats`, { headers: header })
            .pipe(map(chats => {
                return chats;
            }), catchError(this.handleError));
    }

    getChatById(chatId: string): Observable<Chat> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.get<Chat>(`${this.baseUrl}/${user.username}/chat/${chatId}`, { headers: header })
            .pipe(map(chat => {
                console.log("Chat: " + chat.otherUsername);
                return chat;
            }), catchError(this.handleError));
    }

    sendMessage(message, chatId) {
        this.stompClient.send(`/app/send/message/` + chatId, {}, JSON.stringify({
            chatId: chatId,
            text: message.text,
            sender: message.sender,
            receiver: message.receiver
        }));
    }

    createChat(otherUsername: string): Observable<Chat> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);
        let visitor = user.isVisitor ? user.username : otherUsername;
        let organizer = user.isVisitor ? otherUsername : user.username;

        return this.http.post<Chat>(`${this.baseUrl}/createChat`, { visitor: visitor, organizer: organizer }, { headers: header })
            .pipe(map(chat => {
                return chat;
            }), catchError(this.handleError));
    }

    getAllMessagesForChat(chatId: string): Observable<Message[]> {
        let user = this.authService.userValue;
        let header = new HttpHeaders().set("Authorization", 'Basic ' + user.authBasic);

        return this.http.get<Message[]>(`${this.baseUrl}/${user.username}/allMessages/${chatId}`, { headers: header })
            .pipe(map(messages => {
                return messages;
            }), catchError(this.handleError));
    }


    initializeWebSocketConnection(chatId) {
        const serverUrl = `${this.baseUrl}/send`;
        const ws = new SockJS(serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;
        // tslint:disable-next-line:only-arrow-functions
        this.stompClient.connect({}, function (frame) {
            that.stompClient.subscribe(`/message/` + chatId, (message) => {
                if (message.body) {
                    let messJSON: MessageReceived = JSON.parse(message.body);
                    console.log(messJSON);
                    var mess = new Message();
                    mess.text = messJSON.messageText;
                    mess.chatId = chatId;
                    mess.sender = messJSON.sender;

                    that.newMessage.emit(mess);
                }
            });
        });

        return true;
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            throwError(error.error)
        } else {
            // The backend returned an unsuccessful response code.
            console.error(`Backend returned code ${error.status}, ` +
                `body was: ${error.error.message}`);
            return throwError(error.error)
        }
        // Return an observable with a user-facing error message.
        return throwError('Došlo je do pogreške, molimo pokušajte kasnije.');
    }
}
