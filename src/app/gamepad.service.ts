import {
    Injectable,
    OnDestroy,
    RendererFactory2,
    Renderer2,
} from '@angular/core';
import ROSLIB from 'roslib';
import { Subject, Observable, fromEventPattern, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface JoyMessage {
    axes: Array<number>;
    buttons: Array<boolean>;
}

@Injectable({
    providedIn: 'root',
})
export class GamepadService implements OnDestroy {
    private _destroy$ = new Subject();
    private onGamepadConnected_: Observable<GamepadEvent>;
    private onGamepadDisconnected_: Observable<GamepadEvent>;
    public onGamepadConnected: BehaviorSubject<GamepadEvent>;
    public onGamepadDisconnected: BehaviorSubject<GamepadEvent>;
    // private _gameloopInterval: NodeJS.Timeout;

    constructor(private rendererFactory2: RendererFactory2) {
        const renderer = this.rendererFactory2.createRenderer(null, null);
        const renderer2 = this.rendererFactory2.createRenderer(null, null);

        this.createOnGamepadConnectedObservable(renderer);
        this.createOnGamepadDisconnectedObservable(renderer2);
    }

    private createOnGamepadConnectedObservable(renderer: Renderer2) {
        let removeGamepadConnectedEventListener: () => void;
        const createGamepadConnectedEventListener = (
            handler: (e: Event) => boolean | void
        ) => {
            removeGamepadConnectedEventListener = renderer.listen(
                'window',
                'gamepadconnected',
                handler
            );
        };

        this.onGamepadConnected_ = fromEventPattern<GamepadEvent>(
            createGamepadConnectedEventListener,
            () => {
                removeGamepadConnectedEventListener();
            }
        ).pipe(takeUntil(this._destroy$));
        this.onGamepadConnected = new BehaviorSubject(null);
        this.onGamepadConnected_.subscribe((e: GamepadEvent) => {
            this.onGamepadConnected.next(e);
        });
    }

    private createOnGamepadDisconnectedObservable(renderer2: Renderer2) {
        let removeGamepadDisconnectedEventListener: () => void;
        const createGamepadDisconnectedEventListener = (
            handler2: (e: Event) => boolean | void
        ) => {
            removeGamepadDisconnectedEventListener = renderer2.listen(
                'window',
                'gamepaddisconnected',
                handler2
            );
        };

        this.onGamepadDisconnected_ = fromEventPattern<GamepadEvent>(
            createGamepadDisconnectedEventListener,
            () => {
                removeGamepadDisconnectedEventListener();
            }
        ).pipe(takeUntil(this._destroy$));
        this.onGamepadDisconnected = new BehaviorSubject(null);
        this.onGamepadDisconnected_.subscribe((e: GamepadEvent) => {
            this.onGamepadDisconnected.next(e);
        });
    }

    // @HostListener('window:gamepaddisconnected', ['$event'])
    // handleGamepadDisconnected(event: GamepadEvent) {
    //     this.connected = false;
    //     this.gamepad = navigator.getGamepads()[0];
    //     this._gameloopInterval = setInterval(this.gameLoop, 35);
    // }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    gameLoop() {}
}
