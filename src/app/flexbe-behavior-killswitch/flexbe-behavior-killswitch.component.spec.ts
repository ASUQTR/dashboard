import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexbeBehaviorKillswitchComponent } from './flexbe-behavior-killswitch.component';
import { HttpClientModule } from '@angular/common/http';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';

describe('FlexbeBehaviorKillswitchComponent', () => {
    let component: FlexbeBehaviorKillswitchComponent;
    let fixture: ComponentFixture<FlexbeBehaviorKillswitchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlexbeBehaviorKillswitchComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FlexbeBehaviorKillswitchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
