/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar-settings',
    templateUrl: './sidebar-settings.component.html',
    styleUrls: ['./sidebar-settings.component.scss'],
})
export class SidebarSettingsComponent implements OnInit {
    animationState: 'void' | 'enter' = 'enter';
    constructor() {}

    ngOnInit(): void {}
}
