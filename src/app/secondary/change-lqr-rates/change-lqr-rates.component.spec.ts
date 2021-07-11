import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLqrRatesComponent } from './change-lqr-rates.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ChangeLqrRatesComponent', () => {
    let component: ChangeLqrRatesComponent;
    let fixture: ComponentFixture<ChangeLqrRatesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeLqrRatesComponent],
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
        fixture = TestBed.createComponent(ChangeLqrRatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
