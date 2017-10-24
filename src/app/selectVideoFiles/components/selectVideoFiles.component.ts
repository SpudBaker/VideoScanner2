import {ElementRef, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Http, Jsonp, URLSearchParams, Response} from '@angular/http';
import 'rxjs/Rx';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';
import {SESVideo } from '../../model/SESVideo';



@Component({
    selector: 'app-select-video-files',
    templateUrl: 'selectVideoFiles.component.html',
})

export class SelectVideoFilesComponent {
    @ViewChild('fileInput') fileInput: any;
    @ViewChild('videoNode') videoNode: ElementRef; // hidden from display, load videos to get at meta data
    @ViewChild('inputPassword') inputPassword: ElementRef;
    errorDisplayText: string;
    videoLoadStatusText: string;
    private _videoLoading: string;
    private _fileNumber = 0;
    private _fileURL: any;
    private _fileName: string;
    private _videoFiles: File[] = [];
    private finishedLoading = false;
    private loggingIn = false; 

    constructor(private s: SESVideoScannerService, private router: Router, private http: Http) {
        if (!s.sesEmployee) {
            const key = localStorage.getItem('keyString');
            s.checkLastLogIn(key)
            .subscribe(emp => {
                s.sesEmployee = emp;
                s.persistUserDetails(emp);
                s.loggedIn = true;
                this.loggingIn = false;
            },
            err => {
                s.loggedIn = false;
                this.loggingIn = false;
                this.errorDisplayText = err;
            }
        );
        }
    }

    getDisplayText() {
        if (!this.getBrowserCompatability()) {
            return 'This application is designed for the Chrome Browser only. Please change browser.';
        }

        if (!this.s.loggedIn) {
            return 'Please log in to use the SES Video Scanner';
        }

        if (this.filesLoaded()) {
            return 'Press Continue to move to the next step or Cancel to reselect files';
        }

        return 'Use the browse button to select video files for scanning';

    }

    clickInputFileControl() {
        this.finishedLoading = false;
        this.fileInput.click();
    }

    onFileInputChange() {
        const fi = this.fileInput.nativeElement;
        this._videoFiles = fi.files;
        this.loadVideos();
    }

    getButtonState(button: String): Boolean {
        let rv = false;
        switch (button) {
            case 'cancel':
                if (this.filesLoaded() && this.s.loggedIn) {
                    rv = true;
                } else {
                    rv = false;
                }
                break;
            case 'browseforfiles':
                if (this.filesLoaded()) {
                    rv = false;
                } else if (this.s.loggedIn) {
                    rv = true;
                } else {
                    rv = false;
                }
                break;
            case 'continue':
                if (this.filesLoaded() && this.s.loggedIn && this.finishedLoading) {
                    rv = true;
                } else {
                    rv = false;
                }
                break;
            case 'login':
                if (this.s.loggedIn) {
                    rv = false;
                } else {
                    rv = true;
                }
                break;
        }
        return rv;
    }

    getFiles(): File[] {
        return (this._videoFiles);
    }

    filesLoaded(): Boolean {
        return (this._videoFiles.length > 0);
    }

    nextStep() {
        this.router.navigate(['/app-define-video-size-and-start-point']);
    }

    logIn () {
        const v = this.inputPassword.nativeElement.value;
        const s = this.s;
        if (!this.loggingIn && v){
            this.loggingIn = true;
            s.callLogInService(v)
            .subscribe(emp => {
                    s.sesEmployee = emp;
                    s.persistUserDetails(emp);
                    s.loggedIn = true;
                    this.loggingIn = false;
                },
                err => {
                    s.loggedIn = false;
                    this.loggingIn = false;
                    this.errorDisplayText = err;
                }
            );
        }
    }

    checkForLogInEnter(e) {
        if (e === 13) {
            this.logIn();
        }
    }

    loadVideos() {
        if (this._videoFiles.length < this._fileNumber + 1) {
            this.finishedLoading = true;
            return;
        }
        const file = this._videoFiles[this._fileNumber];
        this._fileURL = URL.createObjectURL(file);
        this._fileName = file.name;
        this.videoLoadStatusText = 'loading videos please be patient (video ' + this._fileName + ')';
        this._videoLoading = this._fileName;
        this.videoNode.nativeElement.src = this._fileURL;
    }

    videoLoaded() {
        if (this._videoLoading === this._fileName) {
            const sesVideo = new SESVideo;
            sesVideo.duration = this.videoNode.nativeElement.duration;
            sesVideo.fileURL = this._fileURL;
            sesVideo.fileName = this._fileName;
            this.s.sesVideos.push(sesVideo);
            this._videoLoading = '';
            this._fileNumber++;
            this.loadVideos();
        }
    }

    getBrowserCompatability() {
        if (this.s.browserCompatable) {
            return true;
        } else {
            return false;
        }
    }

}
