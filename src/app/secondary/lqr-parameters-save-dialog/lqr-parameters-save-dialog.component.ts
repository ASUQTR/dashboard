import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-lqr-parameters-save-dialog',
    templateUrl: './lqr-parameters-save-dialog.component.html',
    styleUrls: ['./lqr-parameters-save-dialog.component.scss'],
})
export class LqrParametersSaveDialogComponent implements OnInit {
    name = new FormControl('');

    constructor(protected dialogRef: NbDialogRef<any>) {}

    ngOnInit(): void {}

    save() {
        this.dialogRef.close(this.name.value);
    }

    close() {
        this.dialogRef.close();
    }
}
