import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorTableComponent } from './motor-table.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ChartModule } from 'angular2-chartjs';

describe('MotorTableComponent', () => {
    let component: MotorTableComponent;
    let fixture: ComponentFixture<MotorTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MotorTableComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
                ChartModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MotorTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
