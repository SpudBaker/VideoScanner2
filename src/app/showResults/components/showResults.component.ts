import {ViewChild, ElementRef, Component, OnInit, trigger, state, style, transition, animate} from '@angular/core';
import {Router} from '@angular/router';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';
import {SESVideo } from '../../model/SESVideo';


@Component({
    selector: 'my-show-results',
    templateUrl: 'showResults.component.html',
    animations: [
        trigger('selectedIncident', [
            state('inactive', style({
                backgroundColor: '#eee',
                transform: 'scale(1)'
            })),
            state('active', style({
                backgroundColor: '#cfd8dc',
                transform: 'scale(1.1)'
            })),
            transition('inactive => active', animate('500ms ease-in')),
            transition('active => inactive', animate('500ms ease-out'))
        ])
        ]

})

export class ShowResultsComponent implements OnInit {

    displayText: string;
    displayText2: string;
    videoDisplayWidth: number;
    videoDisplayHeight: number;
    videoDisplayTop: number;
    videoDisplayLeft: number;
    videoPos: number;
    videoPlay: boolean;
    currentlyPlayingVideoName: string;
    _currentSESVideo: SESVideo;
    _initialising: boolean;
    allVideos: SESVideo[];
    @ViewChild('videoNode') videoNode: ElementRef;
    @ViewChild('playSlider') playSlider: ElementRef;

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router) {
        this.allVideos = this.sesVideoScannerService.sesVideos;
        this.videoDisplayWidth = sesVideoScannerService.videoDisplayWidth;
        this.videoDisplayHeight = sesVideoScannerService.videoDisplayHeight;
        this.videoDisplayTop = sesVideoScannerService.videoDisplayTop;
        this.videoDisplayLeft = sesVideoScannerService.videoDisplayLeft;
        this.displayText = 'Incidents are listed below.';
        this.displayText2 = 'Click on the button the play the incident (or the time for a still image)';
        this._initialising = true;
    }

    ngOnInit() {
        if (this._initialising) {
            this.showVideoAndPause(this.sesVideoScannerService.sesVideos[0].fileName,
                this.sesVideoScannerService.sesVideos[0].startPosition);
        }
        this._initialising = false;
    }

    showVideoAndPause(vid: string, pos: number) {
        for (let i = 0; i < this.sesVideoScannerService.sesVideos.length; i++) {
            if (this.sesVideoScannerService.sesVideos[i].fileName === vid) {
                this.videoPos = pos;
                this.videoNode.nativeElement.src = this.sesVideoScannerService.sesVideos[i].fileURL;
                this.currentlyPlayingVideoName = this.sesVideoScannerService.sesVideos[i].fileName;
                this._currentSESVideo = this.sesVideoScannerService.sesVideos[i];
                this.videoPlay = false;
            }
        }
    }

    showVideoAndPlay(vid: string, pos: number) {
        for (let i = 0; i < this.sesVideoScannerService.sesVideos.length; i++) {
            if (this.sesVideoScannerService.sesVideos[i].fileName === vid) {
                this.videoPos = this.sendVideoBackSlightly(pos);
                this.videoNode.nativeElement.src = this.sesVideoScannerService.sesVideos[i].fileURL;
                this.currentlyPlayingVideoName = this.sesVideoScannerService.sesVideos[i].fileName;
                this._currentSESVideo = this.sesVideoScannerService.sesVideos[i];
                this.videoPlay = true;
            }
        }
    }

    videoLoaded() {
        this.videoNode.nativeElement.currentTime = this.videoPos;
        if (this.videoPlay) {
            this.videoNode.nativeElement.play();
        } else {
            this.videoNode.nativeElement.pause();
        }
    }

    sendVideoBackSlightly(pos): number {
        if (pos > 2) {
            return (pos - 3);
        } else {
            return 0;
        }
    }
}


