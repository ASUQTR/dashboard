import { Component, OnInit } from '@angular/core';
import { RoslibService } from '../roslib.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-camera-feed',
    templateUrl: './camera-feed.component.html',
    styleUrls: ['./camera-feed.component.scss'],
})
export class CameraFeedComponent implements OnInit {
    private readonly cameraTopic = '/detectnet/overlay';
    cam1Url =
        'http://' +
        location.hostname +
        ':8080/stream?topic=' +
        this.cameraTopic +
        '&type=mjpeg&quality=20';
    cam2Url = this.cam1Url;
    camTopicExist = false;
    constructor(private rs: RoslibService) {
        this.rs.topicsListData.pipe(distinctUntilChanged()).subscribe((allTopics) => {
            if (allTopics) {
                this.camTopicExist = allTopics?.includes(this.cameraTopic);
            }
        });
    }

    ngOnInit(): void {}
}
