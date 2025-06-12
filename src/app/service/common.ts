import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class Common {
  serverBaseUrl: string = 'https://chat-app-backend-nh9c.onrender.com/api/'
  constructor(private toastr: ToastrService) { }

  showSuccess(type: 'success' | 'error' | 'warning', message: string) {
    if (type == 'success') {
      this.toastr.success(message);
    } else if (type == 'error') {
      this.toastr.error(message);
    } else if (type == 'warning') {
      this.toastr.warning(message);
    }
  }
}
