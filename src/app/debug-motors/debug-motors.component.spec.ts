import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugMotorsComponent } from './debug-motors.component';
import { HttpClientModule } from '@angular/common/http';
import {
    NbIconModule,
    NbLayoutModule,
    NbMenuModule,
    NbThemeModule,
    NbToastrModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('DebugMotorsComponent', () => {
    let component: DebugMotorsComponent;
    let fixture: ComponentFixture<DebugMotorsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DebugMotorsComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbEvaIconsModule,
                NbIconModule,
                NbMenuModule.forRoot(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DebugMotorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
