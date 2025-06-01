export class RegisterFormRequest {
    name: string;
    country: string;
    address: string;
    email: string;
    password: string;
}

export class LoginFormRequest {
    name: string;
    country: string;
    address: string;
    email: string;
    password: string;
}

export class CommonResponse<T> {
    status: 'success' | 'error' | 'warning';
    data: T;
    message: string;
}

export class UserList {
    _id: string;
    name: string;
    // is_online: boolean;
}

export class MessageSendObj {
    sender_id: string;
    receiver_id: string;
    message: string;
}

export class MessagesGetObj {
    sender_id: string;
    receiver_id: string;
    message: string;
    createdAt: string;
}

export class MessageGetObj {
    sender_id: string;
    receiver_id: string;
}