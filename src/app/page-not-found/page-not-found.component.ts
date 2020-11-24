import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    ShortcutInput,
    KeyboardShortcutsComponent,
} from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import {
    animate,
    keyframes,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    animations: [
        trigger('bobSwift', [
            state(
                'start',
                style({
                    transform: 'translateX(-2500px) rotate(0) scale(0.65)',
                })
            ),
            state(
                'finish',
                style({
                    transform: 'translateX(2500px) rotate(-720deg) scale(0.65)',
                })
            ),
            transition('start => finish', animate('7s linear')),
        ]),
    ],
})
export class PageNotFoundComponent implements OnInit, AfterViewInit {
    animationToggle: 'start' | 'finish' = 'start';
    shortcuts: ShortcutInput[] = [];
    @ViewChild('input') input: ElementRef;
    @ViewChild(KeyboardShortcutsComponent)
    private keyboard: KeyboardShortcutsComponent;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.shortcuts.push({
            key: ['up up down down left right left right b a enter'],
            label: 'Sequences',
            description: 'Konami code!',
            command: () => console.log('Konami code'),
        });

        this.keyboard
            .select('up up down down left right left right b a enter')
            .subscribe((e) => {
                this.animationToggle = 'finish';
            });
    }

    onAnimationStart(e: AnimationEvent) {
        this.animationToggle = 'start';
    }
}
