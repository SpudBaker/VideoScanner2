import { Injectable } from '@angular/core';
import { SESVideo } from './model/SESVideo';

@Injectable()
export class SESVideoScannerService {

    sesVideos: SESVideo[] = [];
    videoActualWidth: number;  // Taken from file properties (assume all are same size - should really check!)
    videoActualHeight: number; // As above
    videoDisplayWidth: number; // Determined by user
    videoDisplayHeight: number; // Calculated
    videoDisplayTop: number; // Declared when setting up the page
    videoDisplayLeft: number; // Declared when setting up the page
    scanAreaDisplayTop: number; // Determined by user
    scanAreaDisplayLeft: number; // Determined by user
    scanAreaDisplayWidth: number; // Determined by user
    scanAreaDisplayHeight: number; // Determined by user
    minIntervalBetweenIncidents: number; // Settings page
    scanIterationTimer: number; // Settings page
    showCompareImages: boolean; // Settings page
    scanIncrement: number;
    playSpeedFactor: number; // Settings page
    loggedIn: Boolean = false;
    browserCompatable: boolean = true; // must be Chrome - checked in header component.

    constructor() {
        if (localStorage.getItem('minIntervalBetweenIncidents') === null) {
            this.minIntervalBetweenIncidents = 5;
        } else {
            this.minIntervalBetweenIncidents = parseInt(localStorage.getItem('minIntervalBetweenIncidents'), 10);
        }

        if (localStorage.getItem('scanIterationTimer') === null) {
            this.scanIterationTimer = 125;
        } else {
            this.scanIterationTimer = parseInt(localStorage.getItem('scanIterationTimer'), 10);
        }

        if (localStorage.getItem('playSpeedFactor') === null) {
            this.playSpeedFactor = 5;
        } else {
            this.playSpeedFactor = parseInt(localStorage.getItem('playSpeedFactor'), 10);
        }

        if (localStorage.getItem('showCompareImages') === null) {
            this.showCompareImages = false;
        } else {
            if (localStorage.getItem('showCompareImages') === 'true') {
                this.showCompareImages = true;
            } else {
                this.showCompareImages = false;
            }
        }
    }

    getDisplayFactor() {
        return this.videoDisplayWidth / this.videoActualWidth;
    }

    getScanAreaActualTop() {
        return (this.scanAreaDisplayTop - this.videoDisplayTop) / this.getDisplayFactor();
    }

    getScanAreaActualLeft() {
        return (this.scanAreaDisplayLeft - this.videoDisplayLeft) / this.getDisplayFactor();
    }

    getScanAreaActualWidth() {
        return this.scanAreaDisplayWidth / this.getDisplayFactor();
    }

    getScanAreaActualHeight() {
        return this.scanAreaDisplayHeight / this.getDisplayFactor();
    }

    getAllIncidents() {
        let ia = new Array();
        for (let vid of this.sesVideos) {
            for (let inc of vid.incidents) {
                ia.push(inc);
            }
        }
        return ia;
    }

    setScanIterationTimer(value: number) {
        this.scanIterationTimer = value;
        localStorage.setItem('scanIterationTimer', value.toString());
    }

    setMinIntervalBetweenIncidents(value: number) {
        this.minIntervalBetweenIncidents = value;
        localStorage.setItem('minIntervalBetweenIncidents', value.toString());
    }

    setPlaySpeedFactor(value: number) {
        this.playSpeedFactor = value;
        localStorage.setItem('playSpeedFactor', value.toString());
    }

    setShowCompareImages(value: boolean) {
        this.showCompareImages = value;
        localStorage.setItem('showCompareImages', value.toString());
    }

    getLogInStatusText() {
        if (this.loggedIn === true) {
            return 'SES User logged in';
        } else {
            return '';
        }
    }

    logIn() {
        this.loggedIn = true;
        let d = new Date();
        let s = (((d.getDay() + 3) * (d.getMonth() + 4) * (d.getFullYear()) + 5) - 666 ).toString();
        localStorage.setItem('login', s);
    }

    checkLastLogIn() {
        let s = localStorage.getItem('login');
        let n = parseInt(s, 10);
        let d = new Date();
        n = n + 666;
        if (n === (d.getDay() + 3) * (d.getMonth() + 4) * (d.getFullYear()) + 5) {
            // logged in today
            this.loggedIn = true;
        }
    }

}
