import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auv3dModelComponent } from './auv3d-model.component';
import { HttpClientModule } from '@angular/common/http';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';

describe('Auv3dModelComponent', () => {
    let component: Auv3dModelComponent;
    let fixture: ComponentFixture<Auv3dModelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Auv3dModelComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Auv3dModelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
