import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamepadShellComponent } from './gamepad-shell.component';
import { NbDialogModule, NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';

describe('GamepadShellComponent', () => {
    let component: GamepadShellComponent;
    let fixture: ComponentFixture<GamepadShellComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamepadShellComponent],
            imports: [
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
                NbDialogModule.forRoot(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamepadShellComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
