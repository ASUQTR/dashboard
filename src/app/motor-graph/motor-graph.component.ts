import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { ChartComponent } from 'angular2-chartjs';
import { RosService } from '../ros.service';

@Component({
    selector: 'app-motor-graph',
    templateUrl: './motor-graph.component.html',
    styleUrls: ['./motor-graph.component.scss'],
})
export class MotorGraphComponent implements OnInit, OnDestroy {
    data: any;
    options: any;
    themeSubscription: any;
    @ViewChild(ChartComponent) chartComponent: ChartComponent;
    constructor(private theme: NbThemeService, private rs: RosService) {
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
                        backgroundColor: NbColorHelper.hexToRgbA(colors.control, 0.3),
                        borderColor: colors.control,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 7',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.5),
                        borderColor: colors.primary,
                    },
                    {
                        data: [
                            {
                                t: new Date(),
                                y: 0,
                            },
                        ],
                        label: 'Motor 8',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.5),
                        borderColor: colors.danger,
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
                                unit: 'months',
                            },
                            gridLines: {
                                display: true,
                                color: colors.separator,
                            },
                            ticks: {
                                fontColor: colors.fgText,
                                sampleSize: 20,
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

    ngOnInit(): void {
        this.rs.motorThrottlesData.subscribe((throttles) => {
            this.addChartData(throttles.throttles);
        });
    }

    addChartData(motorThrottles: number[]) {
        motorThrottles.forEach((throttle, index) => {
            this.data.datasets[index].data.push({
                t: new Date(),
                y: throttle,
            });
            this.data.datasets[index].data = this.data.datasets[index].data.slice(
                Math.max(this.data.datasets[index].data.length - 20, 0)
            );
        });

        this.chartComponent.chart.update();
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
