import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLqrDebugInfoComponent } from './control-lqr-debug-info.component';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';

describe('ControlLqrDebugInfoComponent', () => {
    let component: ControlLqrDebugInfoComponent;
    let fixture: ComponentFixture<ControlLqrDebugInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ControlLqrDebugInfoComponent],
            imports: [
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                HttpClientModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlLqrDebugInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
