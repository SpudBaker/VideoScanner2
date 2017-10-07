import {Component} from '@angular/core';
import {Router} from '@angular/router';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})

export class HeaderComponent {
    title = 'SES Video Scanner';

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router) {
    }

    clickHome() {
        this.router.navigate(['/']);
        window.location.reload();
    }
    clickSettings() {
        this.router.navigate(['/app-settings']);
    }

    getBrowserCompatability() {
        if (this.sesVideoScannerService.browserCompatable) {
            return true;
        } else {
            return false;
        }
    }

}
