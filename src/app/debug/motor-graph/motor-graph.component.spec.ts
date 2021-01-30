import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorGraphComponent } from './motor-graph.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ChartComponent } from 'angular2-chartjs';

describe('MotorGraphComponent', () => {
    let component: MotorGraphComponent;
    let fixture: ComponentFixture<MotorGraphComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MotorGraphComponent, ChartComponent],
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
        fixture = TestBed.createComponent(MotorGraphComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
