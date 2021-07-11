import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLqrAttFactorComponent } from './change-lqr-att-factor.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ChangeLqrAttFactorComponent', () => {
    let component: ChangeLqrAttFactorComponent;
    let fixture: ComponentFixture<ChangeLqrAttFactorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangeLqrAttFactorComponent],
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
        fixture = TestBed.createComponent(ChangeLqrAttFactorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
