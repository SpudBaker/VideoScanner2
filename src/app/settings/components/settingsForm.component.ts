import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SESVideoScannerService } from '../../SESVideoScanner.service';
import {Router} from '@angular/router';

@Component({
    selector: 'my-settings-form',
    templateUrl: 'settingsForm.component.html'
})

export class SettingsFormComponent {
    complexForm: FormGroup;
    minIntervalBetweenIncidents: number;
    scanIterationTimer: number;
    showCompareImages: boolean;
    playSpeedFactor: number;
    percentageArea: number;

    constructor(private sesVideoScanningService: SESVideoScannerService, fb: FormBuilder, private router: Router) {
        this.complexForm = fb.group({
            'minIntervalBetweenIncidents': '',
            'scanIterationTimer': '',
            'showCompareImages': '',
            'percentageArea': ''
        });
        this.minIntervalBetweenIncidents = this.sesVideoScanningService.minIntervalBetweenIncidents;
        this.showCompareImages = this.sesVideoScanningService.showCompareImages;
        this.scanIterationTimer = this.sesVideoScanningService.scanIterationTimer;
        this.percentageArea = this.sesVideoScanningService.percentageArea;
    }

    submitSettingsForm(value: any): void {
        this.sesVideoScanningService.setMinIntervalBetweenIncidents(value.minIntervalBetweenIncidents);
        this.sesVideoScanningService.setShowCompareImages(value.showCompareImages);
        this.sesVideoScanningService.setScanIterationTimer(value.scanIterationTimer);
        this.sesVideoScanningService.setPercentageArea(value.percentageArea);

        this.router.navigate(['/']);
        window.location.reload();
    }

}

