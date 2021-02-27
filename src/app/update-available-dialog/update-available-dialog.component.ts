import { Component, OnInit, Optional } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { RestApiService } from '../rest-api.service';

@Component({
    selector: 'app-update-available-dialog',
    templateUrl: './update-available-dialog.component.html',
    styleUrls: ['./update-available-dialog.component.scss'],
})
export class UpdateAvailableDialogComponent implements OnInit {
    isUpdating = false;

    constructor(
        @Optional() protected dialogRef: NbDialogRef<any>,
        private restApi: RestApiService,
        private toastrService: NbToastrService
    ) {}

    ngOnInit(): void {}

    async update() {
        this.isUpdating = true;
        try {
            await this.restApi.triggerDashboardUpdate().toPromise();
            this.dialogRef.close();
            this.toastrService.success(
                'The dashboard update was successful, please refresh the page',
                'Update successful'
            );
        } catch (e) {
            this.isUpdating = false;
            this.toastrService.danger(
                'The dashboard update failed. If you think this is not normal, please contact the IT staff',
                'Update failure'
            );
        }
        this.isUpdating = false;
    }

    close() {
        this.dialogRef.close();
    }
}
