import {ElementRef, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Http, Jsonp, URLSearchParams, Response} from '@angular/http';
import 'rxjs/Rx';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';
import {SESVideo } from '../../model/SESVideo';



@Component({
    selector: 'my-select-video-files',
    templateUrl: 'selectVideoFiles.component.html',
})

export class SelectVideoFilesComponent {
    @ViewChild('fileInput') fileInput: any;
    @ViewChild('videoNode') videoNode: ElementRef; // hidden from display, load videos to get at meta data 
    @ViewChild('inputPassword') inputPassword: ElementRef;
    errorDisplayText: string;
    private _videoLoading: boolean;
    private _fileNumber: number = 0;
    private _fileURL: any;
    private _fileName: string;
    private _videoFiles: File[] = [];

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router, private http: Http, private jsonp: Jsonp) {
        sesVideoScannerService.checkLastLogIn();
    }

    // Angular2 is apparently unable to iterate an array of a larger data structure 
    // and this is the fix. Bizzarely it affects IE11 but not Chrome.  
    hack(val) {
        return Array.from(val);
    }

    getDisplayText() {
        if (!this.getBrowserCompatability()) {
            return 'This application is designed for the Chrome Browser only. Please change browser.';
        }

        if (this.sesVideoScannerService.loggedIn) {
            return 'Please log in to use the SES Video Scanner';
        }

        if (this.filesLoaded()) {
            return 'Press Continue to move to the next step or Cancel to reselect files';
        }

        return 'Use the browse button to select video files for scanning';

    }

    clickInputFileControl() {
        this.fileInput.click();
    }

    onFileInputChange() {
        let fi = this.fileInput.nativeElement;
        this._videoFiles = fi.files;
        this.loadVideos();
    }

    getButtonState(button: String): Boolean {
        let rv = false;
        switch (button) {
            case 'cancel':
                if (this.filesLoaded() && this.sesVideoScannerService.loggedIn) {
                    rv = true;
                } else {
                    rv = false;
                }
                break;
            case 'browseforfiles':
                if (this.filesLoaded()) {
                    rv = false;
                } else if (this.sesVideoScannerService.loggedIn) {
                    rv = true;
                } else {
                    rv = false;
                }
                break;
            case 'continue':
                if (this.filesLoaded() && this.sesVideoScannerService.loggedIn) {
                    rv = true;
                } else {
                    rv = false;
                }
                break;
            case 'login':
                if (this.sesVideoScannerService.loggedIn) {
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
        this.router.navigate(['/my-define-video-size-and-start-point']);
    }

    logIn() {
        let lURL = 'https://script.google.com/macros/s/AKfycbwKQQIa2brENe4j5tHIyee4IA9IChHqzP9znDJuGg7I6OHLDCE/exec';
        let params: URLSearchParams = new URLSearchParams();
        params.set('login', this.inputPassword.nativeElement.value);
        params.set('prefix', 'JSONP_CALLBACK');
        this.jsonp.request(lURL, { search: params, method: 'Get' }).toPromise().
            then(Res => this.checkLoginResponse(Res)).catch(Res => this.handleHttpError(Res));
    }

    checkForLogInEnter(e) {
        if (e === 13) {
            this.logIn();
        }
    }

    checkLoginResponse(res: Response) {
        let s = res.json().authorized;
        if (s === 'true') {
            this.sesVideoScannerService.logIn();

        } else {
            this.sesVideoScannerService.loggedIn = false;
            this.errorDisplayText = 'Incorrect password - please try again';
        }
    }

    handleHttpError(error: Response | any) {
        console.log(error);
        this.errorDisplayText = 'Error attempting to access the login Service - please try again later';
    }

    loadVideos() {
        if (this._videoFiles.length < this._fileNumber + 1) { return; }
        let file = this._videoFiles[this._fileNumber];
        this._fileURL = URL.createObjectURL(file);
        this._fileName = file.name;
        this.videoNode.nativeElement.src = this._fileURL;
        this._videoLoading = true;
    }

    videoLoaded() {
        if (this._videoLoading === true) {
            let sesVideo = new SESVideo;
            sesVideo.duration = this.videoNode.nativeElement.duration;
            sesVideo.fileURL = this._fileURL;
            sesVideo.fileName = this._fileName;
            this.sesVideoScannerService.sesVideos.push(sesVideo);
            this._videoLoading = false;
            this._fileNumber++;
            this.loadVideos();
        }
    }

    getBrowserCompatability() {
        if (this.sesVideoScannerService.browserCompatable) {
            return true;
        } else {
            return false;
        }
    }

}
