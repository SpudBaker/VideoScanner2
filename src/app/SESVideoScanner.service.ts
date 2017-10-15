import { Injectable } from '@angular/core';
import { SESVideo } from './model/sesVideo';
import { SESEmployee } from './model/sesEmployee';
import {Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


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
    sesEmployee: SESEmployee;
    browserCompatable = true; // must be Chrome - checked in header component.

    constructor(private http: Http) {
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
        const ia = new Array();
        for (const vid of this.sesVideos) {
            for (const inc of vid.incidents) {
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

    logIn (password: string) {
        this.callLogInService(password)
        .subscribe(e => this.persistUserDetails(e));
    }

    persistUserDetails(e: SESEmployee){
        this.loggedIn = true;
        this.sesEmployee = e;
        console.log(this.sesEmployee);
        localStorage.setItem('keyString', e.keyString);
    }

    callLogInService(password: string): Observable<SESEmployee> {
        const baseUrl = 'http://www.video-scanner.com';

        console.log(baseUrl + '/auth/login/' + password);

        const employee = this.http
            .get(baseUrl + '/auth/login/' + password)
            .map(res => this.toSESEmployee(res));
            return employee;
    }

    toSESEmployee(r: any): SESEmployee {
        const j = r.json();
        const sesEmployee = <SESEmployee>({
            employee_pk: j.employee_pk,
            first_name: j.first_name,
            last_name: j.last_name,
            organisation_pk: j.organisation_pk,
            organisation_name: j.organisation_name,
            keyString: j.keyString
        });
        console.log(sesEmployee);
        return sesEmployee;
    }

    /*
    logIn() {
        this.loggedIn = true;
        const d = new Date();
        const s = (((d.getDay() + 3) * (d.getMonth() + 4) * (d.getFullYear()) + 5) - 666 ).toString();
        localStorage.setItem('login', s);
    }
    */

    checkLastLogIn() {
    }

    /*
    checkLastLogIn() {
        const s = localStorage.getItem('login');
        let n = parseInt(s, 10);
        const d = new Date();
        n = n + 666;
        if (n === (d.getDay() + 3) * (d.getMonth() + 4) * (d.getFullYear()) + 5) {
            // logged in today
            this.loggedIn = true;
        }
    }
    */
}
