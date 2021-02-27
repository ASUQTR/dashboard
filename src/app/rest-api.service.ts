import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throttleTime } from 'rxjs/operators';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';

@Injectable({
    providedIn: 'root',
})
export class RestApiService {
    controlRosRemotely$ = new Subject<number>();
    private sub: Subscription;

    constructor(private http: HttpClient, private toastrService: NbToastrService) {
        this.controlRosRemotely$
            .pipe(throttleTime(5000))
            .subscribe((data) => this.restApiControlRosRemotely(data));
    }

    restApiControlRosRemotely(start: number): void {
        let status: NbComponentStatus;
        const apiUrl =
            'http://' + location.hostname + ':42069/api/remote?start=' + start.toString();

        console.log('Requested HTTP for ROS control for ', start);
        this.sub = this.http.post(apiUrl, '', {}).subscribe(
            () => {
                status = 'success';
                this.toastrService.show(
                    '420 blaze it',
                    `Successfully ${start ? 'started' : 'stopped'} ROS remotely`,
                    { status }
                );
            },
            (err) => {
                status = 'danger';
                this.toastrService.show(
                    'Error ' + err.status + ': ' + err.statusText,
                    `Failed to ${start ? 'start' : 'stop'} ROS remotely`,
                    { status }
                );
            }
        );
    }

    bitbucketGetLatestCommitLatestRelease(): Observable<any> {
        const apiUrl =
            'https://bitbucket.asuqtr.com/rest/api/1.0/projects/SUBUQTR/repos/asuqtr_interface_web/commits?until=release%2Flatest&limit=1';

        return this.http.get(apiUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer NTI0MTE0MDg4NjExOk2JFFTgu+xAtH1vzOAP52Gg/TZp',
                Accept: 'application/json',
                'X-Atlassian-Token': 'no-check',
            }),
            withCredentials: true,
            reportProgress: true,
            responseType: 'json',
        });
    }

    bitbucketGetVersionOfLatestReleaseBranch(commitID: string): Observable<any> {
        const apiUrl =
            'https://bitbucket.asuqtr.com/rest/api/1.0/projects/SUBUQTR/repos/asuqtr_interface_web/raw/package.json?' +
            commitID;

        return this.http.get(apiUrl, {
            headers: new HttpHeaders({
                Authorization: 'Bearer NTI0MTE0MDg4NjExOk2JFFTgu+xAtH1vzOAP52Gg/TZp',
                Accept: 'application/json',
                'X-Atlassian-Token': 'no-check',
            }),
            withCredentials: true,
            reportProgress: true,
            responseType: 'json',
        });
    }

    saveLqrParams(fileName: string, matrixQ: number[], matrixR: number[]) {
        const apiUrl = 'http://' + location.hostname + ':42069/api/saveLqrParams';

        console.log(`Requested HTTP for saving LQR params to ${fileName}.yaml`);
        const reqData = {
            fileName,
            matrixQ,
            matrixR,
        };
        this.sub = this.http.post(apiUrl, JSON.stringify(reqData), {}).subscribe(
            () => {
                this.toastrService.success(
                    '420 blaze it',
                    `Successfully saved LQR params to ${fileName}.yaml`
                );
            },
            (err) => {
                this.toastrService.danger(
                    'Error ' + err.status + ': ' + err.statusText,
                    `Failed to save LQR params`
                );
            }
        );
    }

    triggerDashboardUpdate() {
        const apiUrl = 'http://' + location.hostname + ':42069/api/updateDashboard';

        return this.http.post(apiUrl, '', {});
    }
}
