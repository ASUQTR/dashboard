import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLqrParametersComponent } from './control-lqr-parameters.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ControlLqrParametersComponent', () => {
    let component: ControlLqrParametersComponent;
    let fixture: ComponentFixture<ControlLqrParametersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ControlLqrParametersComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlLqrParametersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
