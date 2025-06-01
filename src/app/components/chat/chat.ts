import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonHttp } from '../../service/common-http';
import { Router } from '@angular/router';
import { MessageSendObj, MessagesGetObj, UserList } from '../../models/common';
import { CommonModule, DatePipe } from '@angular/common';
import { Socket } from '../../service/socket';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  providers: [DatePipe]
})
export class Chat implements OnInit {
  commonHttp = inject(CommonHttp);
  router = inject(Router);
  socket = inject(Socket);
  userList = signal<UserList[]>([]);
  selectedUser: UserList;
  userListShow: boolean = true;

  get windowWidth(): number {
    return window.innerWidth;
  }

  ngOnInit(): void {
    this.getChat();
  }

  getChat() {
    this.commonHttp.get_user().subscribe(res => {
      if (res.status == 'success') {
        this.userList.set(res.data);
      }
    }, err => {
      if (err.status == 401) {
        sessionStorage.clear()
        this.router.navigateByUrl('login');
      }
    })
  }

  private subscriptions: Subscription[] = [];

  messages = signal<MessagesGetObj[]>([]);
  allChats = signal<string[]>([]);
  activeUsers = signal<{ user_id: string }[]>([]);

  senderUserId: string;

  socketInit() {
    this.messages.set([]);
    this.socket.disconnect();
    this.socket.connect();

    const sendMessageSub = this.socket.listen<MessagesGetObj>('send_message')
      .subscribe((message) => {
        console.log('send_message:', message);
        this.messages.update(prev => [...prev, message]);
      });

    const userIdSub = this.socket.listen<string>('user_id')
      .subscribe((message) => {
        console.log('user_id:', message);
        this.senderUserId = message;
        this.socket.emit('all_chat', {
          sender_id: this.senderUserId,
          receiver_id: this.selectedUser._id
        });
      });

    const sendAllChatSub = this.socket.listen<MessagesGetObj[]>('send_all_chat')
      .subscribe((chat) => {
        console.log('send_all_chat:', chat);
        this.messages.update(prev =>
          [...prev, ...chat].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
      });

    const activeUsersSub = this.socket.listen<any[]>('send_active_users')
      .subscribe((users) => {
        console.log('send_active_users:', users);
        this.activeUsers.set(users);
      });

    this.socket.emit('active_users');

    this.subscriptions.push(sendMessageSub, sendAllChatSub, activeUsersSub, userIdSub);
  }


  getActiveStatus(userId) {
    return this.activeUsers().some(s => s.user_id == userId);
  }

  message = new FormControl('');
  sendMessage() {
    this.socket.emit('message', { sender_id: this.senderUserId, receiver_id: this.selectedUser._id, message: this.message.value })
    this.message = new FormControl('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
