import {ViewChild, ElementRef, AfterViewChecked, Component} from '@angular/core';
import {Router} from '@angular/router';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';
import {SESVideo} from '../../../../src/app/model/SESVideo';
import {SESIncident} from '../../model/SESIncident';

@Component({
    selector: 'my-do-scan',
    templateUrl: 'doScan.component.html'
})

export class DoScanComponent implements AfterViewChecked {

    displayText: string;
    showResultsButton = false;
    showCompareImages: boolean;
    videoDisplayWidth: number;
    videoDisplayHeight: number;
    videoDisplayTop: number;
    videoDisplayLeft: number;
    scanAreaDisplayTop: number;
    scanAreaDisplayLeft: number;
    scanAreaDisplayWidth: number;
    scanAreaDisplayHeight: number;
    percentageMovementImageCurrent: string;
    percentageMovementImageCurrentMinusOne: string;
    percentageMovementImageCurrentMinusTwo: string;
    @ViewChild('videoNode') videoNode: ElementRef;
    @ViewChild('canvas1') canvas1: ElementRef;
    @ViewChild('canvas2') canvas2: ElementRef;
    @ViewChild('canvas3') canvas3: ElementRef;
    @ViewChild('canvasTime') canvasTime: ElementRef;
    @ViewChild('imgImageCurrent') imgImageCurrent: ElementRef;
    @ViewChild('imgImageCurrentMinusOne') imgImageCurrentMinusOne: ElementRef;
    @ViewChild('imgCurrentMinusTwo') imgImageCurrentMinusTwo: ElementRef;
    private _loadingVideo: boolean;
    private _runningIntervalID: any;
    private _doingIteration: boolean;
    private _captureIteration: number;
    private _lastIterationMovementDetected: number;
    private _sesVideoLoaded = false;
    private _selectedVideo: SESVideo;
    private _canvasArray: any[];
    private _ctxArray: any[];
    private _canvasTime: any;
    private _ctxTime: any;
    private _imgImageArray: any[];
    private _imageArray: any[];
    private _movementDetectedThisIteration: boolean;

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router) {
        switch (this.sesVideoScannerService.scanIncrement) {
            case 1:
                this.displayText = 'Scanning in Progress (High)';
                break;
            case 2:
                this.displayText = 'Scanning in Progress (Medium)';
                break;
            case 3:
                this.displayText = 'Scanning in Progress (Low)';
                break;
        }
        this.videoDisplayWidth = sesVideoScannerService.videoDisplayWidth;
        this.videoDisplayHeight = sesVideoScannerService.videoDisplayHeight;
        this.videoDisplayTop = sesVideoScannerService.videoDisplayTop;
        this.videoDisplayLeft = sesVideoScannerService.videoDisplayLeft;
        this.scanAreaDisplayWidth = sesVideoScannerService.scanAreaDisplayWidth;
        this.scanAreaDisplayHeight = sesVideoScannerService.scanAreaDisplayHeight;
        this.scanAreaDisplayTop = sesVideoScannerService.scanAreaDisplayTop;
        this.scanAreaDisplayLeft = sesVideoScannerService.scanAreaDisplayLeft;
        this._lastIterationMovementDetected = 0;
        this._captureIteration = 0;
        this.showCompareImages = sesVideoScannerService.showCompareImages;
    }

    getFiles() {
        return this.sesVideoScannerService.sesVideos;
    }

    ngAfterViewChecked() {
        if (this._sesVideoLoaded === false) {
            this._canvasArray = new Array();
            this._canvasArray[0] = this.canvas1.nativeElement;
            this._canvasArray[1] = this.canvas2.nativeElement;
            this._canvasArray[2] = this.canvas3.nativeElement;
            this._canvasArray[0].height = this.sesVideoScannerService.getScanAreaActualHeight;
            this._canvasArray[0].width = this.sesVideoScannerService.getScanAreaActualWidth;
            this._canvasArray[1].height = this.sesVideoScannerService.getScanAreaActualHeight;
            this._canvasArray[1].width = this.sesVideoScannerService.getScanAreaActualWidth;
            this._canvasArray[2].height = this.sesVideoScannerService.getScanAreaActualHeight;
            this._canvasArray[2].width = this.sesVideoScannerService.getScanAreaActualWidth;
            this._canvasTime = this.canvasTime.nativeElement;
            this._ctxArray = new Array();
            this._ctxArray[0] = this._canvasArray[0].getContext('2d');
            this._ctxArray[1] = this._canvasArray[1].getContext('2d');
            this._ctxArray[2] = this._canvasArray[2].getContext('2d');
            this._ctxTime = this.canvasTime.nativeElement.getContext('2d');
            this._imgImageArray = new Array();
            this._imgImageArray[0] = this.imgImageCurrent.nativeElement;
            this._imgImageArray[1] = this.imgImageCurrentMinusOne.nativeElement;
            this._imgImageArray[2] = this.imgImageCurrentMinusTwo.nativeElement;
            this._imageArray = new Array();
            this.loadVideo();
            this._sesVideoLoaded = true;
        }
    }

    loadVideo(): boolean {
        for (let vid of this.sesVideoScannerService.sesVideos) {
            if (vid.scanned === false) {
                this._loadingVideo = true;
                this.videoNode.nativeElement.src = vid.fileURL;
                this._selectedVideo = vid;
                return true;
            }
        }
        return false;
    }

    videoLoaded() {
        if (this._loadingVideo === true) {
            this._loadingVideo = false;
        } else {
            return;
        }
        this.videoNode.nativeElement.currentTime = this._selectedVideo.startPosition;
        this.scanVideo();
    }

    scanVideo() {
        this._selectedVideo.scanning = true;
        this._runningIntervalID = setInterval(() => this.doScanIteration(), this.sesVideoScannerService.scanIterationTimer);

    }

    stopScan() {
        clearInterval(this._runningIntervalID);
        this._selectedVideo.scanned = true;
        this._selectedVideo.scanning = false;
        this.scanCompleted();
    }

    doScanIteration() {

        if (this._doingIteration === true) { return; }
        this._doingIteration = true;
        this._movementDetectedThisIteration = true;
        if (this._captureIteration > 1) {
            this.cloneImage(2);
        }
        if (this._captureIteration > 0) {
            this.cloneImage(1);
        }
        this.captureImage();
        if (this._captureIteration > 0) {
            this.percentageMovementImageCurrent = this.compareImage(0, 1).toString();
        }
        if (this._captureIteration > 1) {
            this.percentageMovementImageCurrentMinusOne = this.compareImage(1, 2).toString();
            this.percentageMovementImageCurrentMinusTwo = this.compareImage(2, 0).toString();
        }
        if (this._movementDetectedThisIteration === true) {
            if (this._captureIteration - this._lastIterationMovementDetected > this.sesVideoScannerService.minIntervalBetweenIncidents) {
                this._lastIterationMovementDetected = this._captureIteration;
                let i = new SESIncident();
                i.time = this.videoNode.nativeElement.currentTime;
                i.image = this._imageArray[0];
                i.imagePrev1 = this._imageArray[1];
                i.imagePrev2 = this._imageArray[2];
                i.videoFileName = this._selectedVideo.fileName;
                this._canvasTime.height = 18;
                this._canvasTime.width = 100;
                this._ctxTime.drawImage(this.videoNode.nativeElement, 100,
                    this.sesVideoScannerService.videoActualHeight - 18, 100, 18, 0, 0, 100, 18);
                i.imageTime = this._canvasTime.toDataURL('image/png');
                this._selectedVideo.incidents.push(i);
            }
        }

        this.videoNode.nativeElement.currentTime = this.videoNode.nativeElement.currentTime + this.sesVideoScannerService.scanIncrement;
        this._captureIteration++;
        if (this.videoNode.nativeElement.ended) {
            clearInterval(this._runningIntervalID);
            this._selectedVideo.scanned = true;
            this._selectedVideo.scanning = false;
            if (this.loadVideo() === false) {
                this.scanCompleted();
            }
        }
        if (this.showCompareImages === true) {
            clearInterval(this._runningIntervalID);
        }
        this._doingIteration = false;
    }

    cloneImage(imageIndex: number) {
        this._canvasArray[imageIndex].width = this.sesVideoScannerService.getScanAreaActualWidth();
        this._canvasArray[imageIndex].height = this.sesVideoScannerService.getScanAreaActualHeight();
        this._ctxArray[imageIndex].drawImage(this._canvasArray[imageIndex - 1], 0, 0);
        this._imageArray[imageIndex] = this._canvasArray[imageIndex].toDataURL('image/png');
        this._imgImageArray[imageIndex].width = 100;
        this._imgImageArray[imageIndex].src = this._imageArray[imageIndex];
    }

    captureImage() {
        this._canvasArray[0].width = this.sesVideoScannerService.getScanAreaActualWidth();
        this._canvasArray[0].height = this.sesVideoScannerService.getScanAreaActualHeight();
        this._ctxArray[0].drawImage(this.videoNode.nativeElement, this.sesVideoScannerService.getScanAreaActualLeft(),
            this.sesVideoScannerService.getScanAreaActualTop(), this.sesVideoScannerService.getScanAreaActualWidth(),
            this.sesVideoScannerService.getScanAreaActualHeight(), 0, 0, this.sesVideoScannerService.getScanAreaActualWidth(),
            this.sesVideoScannerService.getScanAreaActualHeight());
        this._imageArray[0] = this._canvasArray[0].toDataURL('image/png');
        this._imgImageArray[0].width = 100;
        this._imgImageArray[0].src = this._imageArray[0];
    }

    comparePixel(p1: any, p2: any) {
        let matches = true;
        for (let i = 0; i < p1.length; i++) {
            let t1 = Math.round(p1[i] / 10) * 10;
            let t2 = Math.round(p2[i] / 10) * 10;

            if (t1 !== t2) {
                if ((t1 + 60) < t2 || (t1 - 60) > t2) {
                    matches = false;
                }
            }
        }
        return matches;
    }
    compareImage(imageIndex: number, imageIndex2: number): number {
        let noMovementCount = 0;
        let movementCount = 0;
        let percentageMovement = 0;

        for (let y = 0; y < this.sesVideoScannerService.getScanAreaActualHeight(); y = y + 5) {
            for (let x = 0; x < this.sesVideoScannerService.getScanAreaActualWidth(); x = x + 5) {
                let pixel1 = this._ctxArray[imageIndex].getImageData(x, y, 1, 1);
                let pixel1Data = pixel1.data;

                let pixel2 = this._ctxArray[imageIndex2].getImageData(x, y, 1, 1);
                let pixel2Data = pixel2.data;

                if (this.comparePixel(pixel1Data, pixel2Data) === false) {
                    movementCount++;
                } else {
                    noMovementCount++;
                }
            }
        }
        percentageMovement = 100 * (movementCount / (noMovementCount + movementCount));
        if (percentageMovement < this.sesVideoScannerService.getPercentageArea()) {
            this._movementDetectedThisIteration = false;
        }
        return percentageMovement;
    };

    setCompareTopLeft(iArray: any[], x: number, y: number) {
        if (x < iArray[0]) {
            iArray[0] = x;
        }
        if (y < iArray[1]) {
            iArray[1] = y;
        }
    }

    setCompareBottomRight(iArray: any[], x: number, y: number) {
        if (x > iArray[0]) {
            iArray[0] = [x];
        }
        if (y > iArray[1]) {
            iArray[1] = [y];
        }
    }

    scanCompleted() {
        this.displayText = 'Scanning Completed';
        this.showResultsButton = true;
    }

    nextStep() {
        this.router.navigate(['/my-show-results']);
    }

}
