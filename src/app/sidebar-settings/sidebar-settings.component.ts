/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { NbMenuItem, NbSidebarService, NbSidebarState } from '@nebular/theme';

@Component({
    selector: 'app-sidebar-settings',
    templateUrl: './sidebar-settings.component.html',
    styleUrls: ['./sidebar-settings.component.scss'],
})
export class SidebarSettingsComponent implements OnInit {
    @ViewChild('item') settingSectionAccordion;
    animationState: 'void' | 'enter' = 'enter';
    items: NbMenuItem[] = [
        {
            title: 'Home',
            link: '/main',
            icon: 'home-outline',
            home: true,
        },
        {
            title: 'More',
            link: '/secondary',
            icon: 'more-horizontal',
        },
        {
            title: 'Debug',
            link: '/debug',
            icon: 'activity',
        },
    ];
    sidebarState: NbSidebarState;
    constructor(public sidebarService: NbSidebarService) {}

    ngOnInit(): void {
        this.sidebarService.onToggle().subscribe(() => {
            this.sidebarService.getSidebarState().subscribe((value) => {
                this.sidebarState = value;
                if (this.sidebarState !== 'expanded') {
                    if (this.settingSectionAccordion.expanded) {
                        this.settingSectionAccordion.toggle();
                    }
                }
            });
        });

        this.sidebarService.onExpand().subscribe(() => {
            this.sidebarState = 'expanded';
        });
    }

    settingSectionCollapseEventListener(): void {
        if (this.sidebarState !== 'expanded') {
            this.sidebarService.expand();
        }
    }
}
