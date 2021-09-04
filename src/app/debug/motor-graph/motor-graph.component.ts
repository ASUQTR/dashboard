import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { ChartComponent } from 'angular2-chartjs';
import { RoslibService } from '../../roslib.service';
import { interval, Subscription } from 'rxjs';
import { throttle } from 'rxjs/operators';

@Component({
    selector: 'app-motor-graph',
    templateUrl: './motor-graph.component.html',
    styleUrls: ['./motor-graph.component.scss'],
})
export class MotorGraphComponent implements AfterViewInit, OnDestroy {
    data: any;
    options: any;
    themeSubscription: any;
    @ViewChild(ChartComponent) chartComponent: ChartComponent;
    private motorDataSubscription: Subscription;

    constructor(private theme: NbThemeService, private rs: RoslibService) {
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
            const colors: any = config.variables;

            this.data = {
                datasets: [
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 1',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                        borderColor: colors.primary,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 2',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
                        borderColor: colors.danger,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 3',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
                        borderColor: colors.info,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 4',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.success, 0.3),
                        borderColor: colors.success,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 5',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.warning, 0.3),
                        borderColor: colors.warning,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 6',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.successLight, 0.5),
                        borderColor: colors.successLight,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 7',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.warningLight, 0.5),
                        borderColor: colors.warningLight,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 8',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.dangerLight, 0.5),
                        borderColor: colors.dangerLight,
                    },
                ],
            };

            this.options = {
                responsive: true,
                maintainAspectRatio: true,
                animation: false,
                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            time: {
                                unit: 'second',
                            },
                            gridLines: {
                                display: true,
                                color: colors.separator,
                            },
                            ticks: {
                                fontColor: colors.fgText,
                                sampleSize: 500,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: colors.separator,
                            },
                            ticks: {
                                fontColor: colors.fgText,
                                suggestedMin: -1,
                                suggestedMax: 1,
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

    ngAfterViewInit(): void {
        this.motorDataSubscription = this.rs.motorThrottlesData
            .pipe(throttle(() => interval(500)))
            .subscribe((throttlesMsg) => {
                if (throttlesMsg) {
                    this.addChartData(throttlesMsg.throttles);
                }
            });
    }

    addChartData(motorThrottles: number[]) {
        motorThrottles.forEach((value, index) => {
            this.data.datasets[index].data.push({
                t: new Date(),
                y: value,
            });
            this.data.datasets[index].data = this.data.datasets[index].data.slice(
                Math.max(this.data.datasets[index].data.length - 20, 0)
            );
        });

        this.chartComponent.chart.update();
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
        this.motorDataSubscription.unsubscribe();
    }
}
