import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
    selector: 'app-theme-changer',
    templateUrl: './theme-changer.component.html',
    styleUrls: ['./theme-changer.component.scss'],
})
export class ThemeChangerComponent implements OnInit {
    toggleNgModel = true;
    constructor(private themeService: NbThemeService) {}

    ngOnInit(): void {}

    onToggle(value: boolean) {
        this.themeService.changeTheme(value ? 'dark' : 'default');
    }
}
