/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import {
    NbDialogModule,
    NbIconModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule,
    NbToastrModule,
} from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { RouterTestingModule } from '@angular/router/testing';

describe('ToolbarComponent', () => {
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ToolbarComponent],
                providers: [],
                imports: [
                    HttpClientModule,
                    NbToastrModule.forRoot(),
                    NbThemeModule.forRoot(),
                    NbLayoutModule,
                    NbEvaIconsModule,
                    NbIconModule,
                    NbSidebarModule.forRoot(),
                    RouterTestingModule.withRoutes([]),
                    NbDialogModule.forRoot(),
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
