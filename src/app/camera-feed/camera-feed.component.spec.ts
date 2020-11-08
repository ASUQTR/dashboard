import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraFeedComponent } from './camera-feed.component';
import { HttpClientModule } from '@angular/common/http';
import { NbIconModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

describe('CameraFeedComponent', () => {
    let component: CameraFeedComponent;
    let fixture: ComponentFixture<CameraFeedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CameraFeedComponent],
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
        fixture = TestBed.createComponent(CameraFeedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
