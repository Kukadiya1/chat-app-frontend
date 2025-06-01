import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket as IOSocket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class Socket {
  private socket!: IOSocket;
  private readonly SOCKET_URL = 'http://localhost:3000'; // Replace with your backend URL

  constructor() { }

  connect(): void {
    const token = sessionStorage.getItem('token'); // Get your JWT or token here

    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket'], // force websocket transport
      query: {
        token: token ?? '' // Send token in query
      }
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });
  }

  // Emit events
  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  // Listen to events
  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket.on(event, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
