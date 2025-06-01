import { Routes } from '@angular/router';
import { UserSignup } from './components/user-signup/user-signup';
import { Component } from '@angular/core';
import { Layout } from './components/layout/layout';
import { Chat } from './components/chat/chat';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: UserSignup
    },
    {
        path: 'chat',
        component: Layout,
        pathMatch: 'full',
        children: [
            {
                path: '',
                component: Chat
            }
        ]
    }
];
