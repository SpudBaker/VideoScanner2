import {Component} from '@angular/core';
import 'styles.css';
import {SESVideoScannerService} from './SESVideoScanner.service';
import {GeneralUtilitiesService} from './GeneralUtilities.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [SESVideoScannerService, GeneralUtilitiesService]
})



export class AppComponent {

    constructor(private sesVideoScannerService: SESVideoScannerService, generalUtilitiesService: GeneralUtilitiesService) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            // all good it's chrome
            sesVideoScannerService.browserCompatable = true;
        } else {
            sesVideoScannerService.browserCompatable = false;
        }

    }
}

