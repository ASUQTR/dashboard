import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvailableDialogComponent } from './update-available-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';

describe('UpdateAvailableDialogComponent', () => {
    let component: UpdateAvailableDialogComponent;
    let fixture: ComponentFixture<UpdateAvailableDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UpdateAvailableDialogComponent],
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateAvailableDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
