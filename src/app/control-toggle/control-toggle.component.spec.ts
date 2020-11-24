import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlToggleComponent } from './control-toggle.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('ControlToggleComponent', () => {
    let component: ControlToggleComponent;
    let fixture: ComponentFixture<ControlToggleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ControlToggleComponent],
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
        fixture = TestBed.createComponent(ControlToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
