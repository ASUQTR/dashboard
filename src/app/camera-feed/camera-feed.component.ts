import { Component, OnInit } from '@angular/core';
import { RosService } from '../ros.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-camera-feed',
    templateUrl: './camera-feed.component.html',
    styleUrls: ['./camera-feed.component.scss'],
})
export class CameraFeedComponent implements OnInit {
    private readonly cameraTopic = '/detectnet/overlay';
    cam1Url =
        'http://' + location.hostname + ':8080/stream?topic=/detectnet/overlay';
    cam2Url = this.cam1Url;
    camTopicExist = false;
    constructor(private rs: RosService) {
        this.rs.topicsListData
            .pipe(distinctUntilChanged())
            .subscribe((allTopics) => {
                if (allTopics) {
                    this.camTopicExist = allTopics.includes(
                        '/detectnet/overlay'
                    );
                }
            });
    }

    ngOnInit(): void {}
}
