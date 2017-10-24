import { Injectable } from '@angular/core';
import { SESVideo } from './model/sesVideo';
import { SESEmployee } from './model/sesEmployee';
import {Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


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
    loggedIn = false;
    sesEmployee: SESEmployee;
    browserCompatable = true; // must be Chrome - checked in header component.
    baseUrl = 'http://www.video-scanner.com';

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
            return this.sesEmployee.first_name + ' ' + this.sesEmployee.last_name + ' / ' +
                this.sesEmployee.organisation_name;
        } else {
            return '';
        }
    }

    persistUserDetails(e: SESEmployee){
        this.sesEmployee = e;
        localStorage.setItem('keyString', e.keyString);
    }

    callLogInService(password: string): Observable<SESEmployee>{
        return this.http
            .get(this.baseUrl + '/auth/login/' + password)
            .map((res: Response) => {
                return this.toSESEmployee(res);
                })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Password not recognised');
                } else {
                    return Observable.throw(e);
                }
            });
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
        return sesEmployee;
    }

    checkLastLogIn(key: string): Observable<SESEmployee> {
            return this.http
            .get(this.baseUrl + '/auth/validate/' + key)
            .map((res: Response) => {
                return this.toSESEmployee(res);
            })
            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('');
                } else {
                    return Observable.throw(e);
                }
            })
    }
}
