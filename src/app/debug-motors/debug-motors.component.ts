import { Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-debug-motors',
    templateUrl: './debug-motors.component.html',
    styleUrls: ['./debug-motors.component.scss'],
})
export class DebugMotorsComponent implements OnInit {
    display = 'graph';
    displayChoices = [{ title: 'Graph' }, { title: 'Table' }];

    constructor(private menuService: NbMenuService) {}

    ngOnInit(): void {
        this.menuService
            .onItemClick()
            .pipe(filter((menu) => menu.tag === 'debugMotors'))
            .subscribe((menuClick) => {
                this.display = menuClick.item.title.toLowerCase();
            });
    }
}
