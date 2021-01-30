import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepthMeterComponent } from './depth-meter.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('DepthMeterComponent', () => {
    let component: DepthMeterComponent;
    let fixture: ComponentFixture<DepthMeterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DepthMeterComponent],
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
        fixture = TestBed.createComponent(DepthMeterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
