import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RoslibService } from '../roslib.service';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { ChartComponent } from 'angular2-chartjs';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Vector3Message } from 'ngx-roslib';

@Component({
    selector: 'app-nav-current-position-display',
    templateUrl: './nav-current-position-display.component.html',
    styleUrls: ['./nav-current-position-display.component.scss'],
})
export class NavCurrentPositionDisplayComponent implements OnInit, AfterViewInit, OnDestroy {
    data: any;
    options: any;
    themeSubscription: Subscription;
    @ViewChild(ChartComponent) chartComponent: ChartComponent;
    private currentPositionDataSubscription: Subscription;
    tags = new Observable<{ name: string; position: Vector3Message }>();
    private tagSubscription: Subscription;
    colors: string[];
    numberOfTags = 0;
    readonly numberOfColors = 10;

    constructor(private theme: NbThemeService, public rs: RoslibService) {
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
            const colors: any = config.variables;
            this.colors = [
                colors.danger,
                colors.warning,
                colors.success,
                colors.info,
                colors.primary,
                colors.dangerLight,
                colors.warningLight,
                colors.successLight,
                colors.infoLight,
                colors.primaryLight,
            ];

            this.data = {
                datasets: [
                    {
                        data: [
                            {
                                x: 0,
                                y: 0,
                            },
                        ],
                        label: 'Current Position',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 1),
                        borderColor: colors.primary,
                        pointStyle: 'triangle',
                        radius: 15,
                        hoverRadius: 20,
                    },
                    {
                        data: [
                            {
                                x: 0,
                                y: 0,
                            },
                        ],
                        label: 'Origin',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.info, 1),
                        borderColor: colors.info,
                        pointStyle: 'round',
                        radius: 3,
                        hoverRadius: 5,
                    },
                ],
            };

            this.options = {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    xAxes: [
                        {
                            offset: true,
                            grace: '25',
                            gridLines: {
                                display: true,
                                color: colors.separator,
                            },
                            ticks: {
                                fontColor: colors.fgText,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            offset: true,
                            grace: '25',
                            gridLines: {
                                display: true,
                                color: colors.separator,
                            },
                            ticks: {
                                fontColor: colors.fgText,
                            },
                        },
                    ],
                },
                legend: {
                    labels: {
                        fontColor: colors.fgText,
                    },
                },
            };
        });
    }
    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.tagSubscription = this.rs.tagRequestsData
            .pipe(
                withLatestFrom(this.rs.currentPositionData),
                map(([name, position]) => ({ name, position }))
            )
            .subscribe((tag) => {
                this.data.datasets.push({
                    label: tag.name,
                    pointStyle: 'crossRot',
                    borderColor: this.colors[this.numberOfTags % (this.numberOfColors - 1)],
                    backgroundColor: NbColorHelper.hexToRgbA(
                        this.colors[this.numberOfTags++ % (this.numberOfColors - 1)],
                        1
                    ),
                    data: [
                        {
                            x: tag.position.x,
                            y: tag.position.y,
                        },
                    ],
                    radius: 10,
                });
                this.chartComponent.chart.update();
            });

        this.currentPositionDataSubscription = this.rs.currentPositionData.subscribe((pos) => {
            if (pos) {
                this.data.datasets[0].data.pop();
                this.data.datasets[0].data.push({ x: pos.x, y: pos.y });
                this.chartComponent.chart.update();
            }
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
        this.currentPositionDataSubscription.unsubscribe();
        this.tagSubscription.unsubscribe();
    }
}
