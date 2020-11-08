import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlStateDisplayComponent } from './control-state-display.component';
import { HttpClientModule } from '@angular/common/http';
import {
    NbGlobalLogicalPosition,
    NbIconModule,
    NbLayoutModule,
    NbOverlayModule,
    NbOverlayService,
    NbThemeModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ControlStateDisplayComponent', () => {
    let component: ControlStateDisplayComponent;
    let fixture: ComponentFixture<ControlStateDisplayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ControlStateDisplayComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
            ],
            providers: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlStateDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
