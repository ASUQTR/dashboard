import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcbTempMeterComponent } from './pcb-temp-meter.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('PcbTempMeterComponent', () => {
    let component: PcbTempMeterComponent;
    let fixture: ComponentFixture<PcbTempMeterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PcbTempMeterComponent],
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
        fixture = TestBed.createComponent(PcbTempMeterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
