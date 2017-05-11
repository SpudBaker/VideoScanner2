import {Component} from '@angular/core';
import {Router} from '@angular/router';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';

@Component({
    selector: 'my-settings',
    templateUrl: 'settings.component.html',
})

export class SettingsComponent {
    displayText: String;

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router) {
        this.displayText = 'Settings will be saved for future use on this computer';
    }
}
