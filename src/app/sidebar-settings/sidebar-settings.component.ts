/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
    selector: 'app-sidebar-settings',
    templateUrl: './sidebar-settings.component.html',
    styleUrls: ['./sidebar-settings.component.scss'],
})
export class SidebarSettingsComponent implements OnInit {
    animationState: 'void' | 'enter' = 'enter';
    items: NbMenuItem[] = [
        {
            title: 'Home',
            link: '/main',
            icon: 'home-outline',
        },
        {
            title: 'More',
            link: 'secondary',
            icon: 'more-horizontal',
        },
        {
            title: 'Debug',
            link: 'debug',
            icon: 'activity',
        },
    ];
    constructor() {}

    ngOnInit(): void {}
}
