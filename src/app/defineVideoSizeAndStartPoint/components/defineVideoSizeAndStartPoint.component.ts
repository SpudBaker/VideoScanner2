import {ViewChild, ElementRef, Component, AfterViewChecked, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';


@Component({
    selector: 'my-define-video-size-and-start-point',
    templateUrl: 'defineVideoSizeAndStartPoint.component.html'
})

export class DefineVideoSizeAndStartPointComponent implements AfterViewChecked, OnInit {
    videoDisplayWidth: number;
    videoDisplayHeight: number;
    videoDisplayTop: number;
    videoDisplayLeft: number;
    scanAreaDisplayTop: number;
    scanAreaDisplayLeft: number;
    scanAreaDisplayWidth: number;
    scanAreaDisplayHeight: number;
    @ViewChild('videoNode') videoNode: ElementRef;
    @ViewChild('canvasNode') canvasNode: ElementRef;
    @ViewChild('inputSlideVideoSize') inputSlideVideoSize: ElementRef;
    sesVideoLoaded: boolean = false;

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router) {
        this.videoDisplayWidth = sesVideoScannerService.videoDisplayWidth;
        this.videoDisplayHeight = sesVideoScannerService.videoDisplayHeight;
        this.videoDisplayTop = sesVideoScannerService.videoDisplayTop;
        this.videoDisplayLeft = sesVideoScannerService.videoDisplayLeft;
        this.scanAreaDisplayTop = sesVideoScannerService.scanAreaDisplayTop;
        this.scanAreaDisplayLeft = sesVideoScannerService.scanAreaDisplayLeft;
        this.scanAreaDisplayWidth = sesVideoScannerService.scanAreaDisplayWidth;
        this.scanAreaDisplayHeight = sesVideoScannerService.scanAreaDisplayHeight;
    }

    changeSlide(w: string) {
        this.videoDisplayWidth = parseInt(w, 10);
        this.videoDisplayHeight = this.sesVideoScannerService.videoActualHeight *
            (this.videoDisplayWidth / this.sesVideoScannerService.videoActualWidth);
    }

    getText() {
        return 'Resize the video using the slider. ' +
            'Navigate to where the camera is correctly in position and from where scanning will commence.Press "Next".';
    }

    ngOnInit() {
        let l = localStorage.getItem('videoDisplayWidth');
        if (l === null) {
            this.videoDisplayWidth = 600;
        } else {
            this.videoDisplayWidth = parseInt(l, 10);
            this.inputSlideVideoSize.nativeElement.value = l;
        }
        this.videoDisplayLeft = 500;
        this.videoDisplayTop = 100;
    }

    ngAfterViewChecked() {
        if (this.sesVideoLoaded === false) {
            this.videoNode.nativeElement.src = this.sesVideoScannerService.sesVideos[0].fileURL;
            this.sesVideoLoaded = true;
        }
    }

    videoLoaded() {
        this.sesVideoScannerService.videoActualHeight = this.videoNode.nativeElement.videoHeight;
        this.sesVideoScannerService.videoActualWidth = this.videoNode.nativeElement.videoWidth;
        this.videoDisplayHeight = this.videoNode.nativeElement.videoHeight *
            (this.videoDisplayWidth / this.videoNode.nativeElement.videoWidth);
    }

    nextStep() {
        this.saveVideoImage();
        this.sesVideoScannerService.videoDisplayWidth = this.videoDisplayWidth;
        localStorage.setItem('videoDisplayWidth', this.videoDisplayWidth.toString());
        this.sesVideoScannerService.videoDisplayHeight = this.videoDisplayHeight;
        this.sesVideoScannerService.videoDisplayTop = this.videoDisplayTop;
        this.sesVideoScannerService.videoDisplayLeft = this.videoDisplayLeft;
        this.sesVideoScannerService.scanAreaDisplayTop = this.scanAreaDisplayTop;
        this.sesVideoScannerService.scanAreaDisplayLeft = this.scanAreaDisplayLeft;
        this.sesVideoScannerService.scanAreaDisplayWidth = this.scanAreaDisplayWidth;
        this.sesVideoScannerService.scanAreaDisplayHeight = this.scanAreaDisplayHeight;
        this.router.navigate(['/my-define-scan-area']);
    }

    saveVideoImage() {
        let context = this.canvasNode.nativeElement.getContext('2d');
        context.drawImage(this.videoNode.nativeElement, 0, 0, this.videoDisplayWidth, this.videoDisplayHeight);
        this.sesVideoScannerService.sesVideos[0].startPositionImage = this.canvasNode.nativeElement.toDataURL('image/png');
        this.sesVideoScannerService.sesVideos[0].startPosition = this.videoNode.nativeElement.currentTime;
    }

    useNextVideo() {
        this.sesVideoScannerService.sesVideos.shift();
        this.videoNode.nativeElement.src = this.sesVideoScannerService.sesVideos[0].fileURL;
    }

    laterVideoExists(): boolean {
        if (this.sesVideoScannerService.sesVideos.length > 1) {
            return true;
        } else {
            return false;
        }
    }

}
