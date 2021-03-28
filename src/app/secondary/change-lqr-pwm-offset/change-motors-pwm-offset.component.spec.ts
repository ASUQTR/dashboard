import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMotorsPwmOffsetComponent } from './change-motors-pwm-offset.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ChangeLqrPwmOffsetComponent', () => {
    let component: ChangeMotorsPwmOffsetComponent;
    let fixture: ComponentFixture<ChangeMotorsPwmOffsetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeMotorsPwmOffsetComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangeMotorsPwmOffsetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
