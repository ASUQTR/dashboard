/*
 * Copyright (c) 2020 ASUQTR student club at UQTR in Canada. All rights reserved.
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThemeChangerComponent } from './theme-changer.component';
import { NbThemeModule } from '@nebular/theme';

describe('ThemeChangerComponent', () => {
    let component: ThemeChangerComponent;
    let fixture: ComponentFixture<ThemeChangerComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ThemeChangerComponent],
                providers: [],
                imports: [NbThemeModule.forRoot()],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ThemeChangerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
