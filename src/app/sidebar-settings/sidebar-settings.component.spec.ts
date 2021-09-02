/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarSettingsComponent } from './sidebar-settings.component';
import { HttpClientModule } from '@angular/common/http';
import {
    NbIconModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule,
    NbToastrModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { RouterTestingModule } from '@angular/router/testing';
import { ThemeChangerComponent } from '../theme-changer/theme-changer.component';
import { ViewSettingsComponent } from '../view-settings/view-settings.component';

describe('SidebarSettingsComponent', () => {
    let component: SidebarSettingsComponent;
    let fixture: ComponentFixture<SidebarSettingsComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    SidebarSettingsComponent,
                    ThemeChangerComponent,
                    ViewSettingsComponent,
                ],
                imports: [
                    HttpClientModule,
                    NbToastrModule.forRoot(),
                    NbThemeModule.forRoot(),
                    NbLayoutModule,
                    NbEvaIconsModule,
                    NbIconModule,
                    NbSidebarModule.forRoot(),
                    RouterTestingModule.withRoutes([]),
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
