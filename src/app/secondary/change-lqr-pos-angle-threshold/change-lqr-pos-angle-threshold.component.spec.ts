import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLqrPosAngleThresholdComponent } from './change-lqr-pos-angle-threshold.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ChangeLqrPosAngleThresholdComponent', () => {
    let component: ChangeLqrPosAngleThresholdComponent;
    let fixture: ComponentFixture<ChangeLqrPosAngleThresholdComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeLqrPosAngleThresholdComponent],
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
        fixture = TestBed.createComponent(ChangeLqrPosAngleThresholdComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
