import { Component, OnInit, Optional } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'app-lqr-parameters-save-dialog',
    templateUrl: './lqr-parameters-save-dialog.component.html',
    styleUrls: ['./lqr-parameters-save-dialog.component.scss'],
})
export class LqrParametersSaveDialogComponent implements OnInit {
    name = new UntypedFormControl('');

    constructor(@Optional() protected dialogRef: NbDialogRef<any>) {}

    ngOnInit(): void {}

    save() {
        this.dialogRef.close(this.name.value);
    }

    close() {
        this.dialogRef.close();
    }
}
