import {
    Injectable,
    OnDestroy,
    RendererFactory2,
    Renderer2,
} from '@angular/core';
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
    private destroy$ = new Subject();
    private onGamepadConnected$: Observable<GamepadEvent>;
    private onGamepadDisconnected$: Observable<GamepadEvent>;
    public onGamepadConnected: BehaviorSubject<GamepadEvent>;
    public onGamepadDisconnected: BehaviorSubject<GamepadEvent>;
    public gamepadConnected = false;
    private gamepads: Gamepad[];
    private gamepadSource = new BehaviorSubject<Array<Gamepad>>(null);
    gamepadData = this.gamepadSource.asObservable();
    private gamepadInterval: NodeJS.Timeout;

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

        this.onGamepadConnected$ = fromEventPattern<GamepadEvent>(
            createGamepadConnectedEventListener,
            () => {
                removeGamepadConnectedEventListener();
            }
        ).pipe(takeUntil(this.destroy$));
        this.onGamepadConnected = new BehaviorSubject(null);
        this.onGamepadConnected$.subscribe((e: GamepadEvent) => {
            this.onGamepadConnected.next(e);
            this.gamepadConnected = true;
            this.gameLoop();
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

        this.onGamepadDisconnected$ = fromEventPattern<GamepadEvent>(
            createGamepadDisconnectedEventListener,
            () => {
                removeGamepadDisconnectedEventListener();
            }
        ).pipe(takeUntil(this.destroy$));
        this.onGamepadDisconnected = new BehaviorSubject(null);
        this.onGamepadDisconnected$.subscribe((e: GamepadEvent) => {
            this.onGamepadDisconnected.next(e);
            this.gamepadConnected = false;
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.onGamepadConnected.complete();
        this.onGamepadDisconnected.complete();
        clearInterval(this.gamepadInterval);
    }

    gameLoop() {
        this.gamepads = this.pollGamepads();
        this.gamepadSource.next(this.gamepads);
        if (this.gamepadConnected) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    pollGamepads() {
        return navigator.getGamepads();
    }
}
