import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
    selector: 'app-gamepad-shell',
    templateUrl: './gamepad-shell.component.html',
    styleUrls: ['./gamepad-shell.component.scss'],
})
export class GamepadShellComponent implements OnInit {
    constructor(private dialogService: NbDialogService) {}

    ngOnInit(): void {}

    openGamepadBiggerInDialog(dialog: TemplateRef<any>) {
        this.dialogService.open(dialog);
    }
}
