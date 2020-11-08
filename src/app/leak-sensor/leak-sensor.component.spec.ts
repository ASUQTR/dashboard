import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeakSensorComponent } from './leak-sensor.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('LeakSensorComponent', () => {
    let component: LeakSensorComponent;
    let fixture: ComponentFixture<LeakSensorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LeakSensorComponent],
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
        fixture = TestBed.createComponent(LeakSensorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
