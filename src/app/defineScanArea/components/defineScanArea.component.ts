import {ViewChild, ElementRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import 'styles.css';
import {SESVideoScannerService} from '../../SESVideoScanner.service';


@Component({
    selector: 'my-define-scan-area',
    templateUrl: 'defineScanArea.component.html'
})

export class DefineScanAreaComponent implements OnInit {

    videoDisplayWidth: number;
    videoDisplayTop: number;
    videoDisplayLeft: number;
    videoDisplayHeight: number;
    scanAreaDisplayTop: number;
    scanAreaDisplayLeft: number;
    scanAreaDisplayWidth: number;
    scanAreaDisplayHeight: number;
    resizeHandleTop: number;
    resizeHandleLeft: number;
    @ViewChild('imgElement') imgElement: ElementRef;
    private _startDragX: number;
    private _startdragY: number;

    constructor(private sesVideoScannerService: SESVideoScannerService, private router: Router) {
        this.videoDisplayWidth = sesVideoScannerService.videoDisplayWidth;
        this.videoDisplayTop = sesVideoScannerService.videoDisplayTop;
        this.videoDisplayLeft = sesVideoScannerService.videoDisplayLeft;
        this.videoDisplayHeight = sesVideoScannerService.videoDisplayHeight;
        this.scanAreaDisplayTop = sesVideoScannerService.scanAreaDisplayTop;
        this.scanAreaDisplayLeft = sesVideoScannerService.scanAreaDisplayLeft;
        this.scanAreaDisplayWidth = sesVideoScannerService.scanAreaDisplayWidth;
        this.scanAreaDisplayHeight = sesVideoScannerService.scanAreaDisplayHeight;
        const l = localStorage.getItem('scanIncrement');
        if (l === null) {
            this.sesVideoScannerService.scanIncrement = 2;
        } else {
            this.sesVideoScannerService.scanIncrement = parseInt(l, 10);
        }
    }

    getText() {
        return 'Position the highlighted scan area by dragging. Drag the white square to resize. When done press "Next".';
    }

    getImage() {
        return this.sesVideoScannerService.sesVideos[0].startPositionImage;
    }

    ngOnInit() {
        this.scanAreaDisplayHeight = 100;
        this.scanAreaDisplayLeft = 600;
        this.scanAreaDisplayTop = 200;
        this.scanAreaDisplayWidth = 100;
        this.positionResizeHandle();
    }

    dragStart(e: DragEvent) {
        this._startDragX = e.clientX;
        this._startdragY = e.clientY;
    }

    dragEnd(e: DragEvent) {
        let dragEndLeft = this.scanAreaDisplayLeft - this._startDragX + e.clientX;
        let dragEndTop = this.scanAreaDisplayTop - this._startdragY + e.clientY;
        if (dragEndLeft < this.videoDisplayLeft) {
            dragEndLeft = this.videoDisplayLeft;
        }
        if (dragEndLeft > this.videoDisplayLeft - this.scanAreaDisplayWidth + this.videoDisplayWidth) {
            dragEndLeft = this.videoDisplayLeft - this.scanAreaDisplayWidth + this.videoDisplayWidth - 10; // -10 is for css borders :-(
        }
        if (dragEndTop < this.videoDisplayTop) {
            dragEndTop = this.videoDisplayTop;
        }
        if (dragEndTop > this.videoDisplayTop - this.scanAreaDisplayHeight + this.videoDisplayHeight) {
            dragEndTop = this.videoDisplayTop - this.scanAreaDisplayHeight + this.videoDisplayHeight - 10; // -10 is for css borders :-(
        }

        this.scanAreaDisplayLeft = dragEndLeft;
        this.scanAreaDisplayTop = dragEndTop;
        this.positionResizeHandle();
    }

    resizeDragStart(e: DragEvent) {
        this._startDragX = e.clientX;
        this._startdragY = e.clientY;
    }

    resizeDragEnd(e: DragEvent) {
        let dragEndWidth = this.scanAreaDisplayWidth - this._startDragX + e.clientX;
        let dragEndHeight = this.scanAreaDisplayHeight - this._startdragY + e.clientY;

        if (this.scanAreaDisplayLeft + dragEndWidth > this.videoDisplayWidth + this.videoDisplayLeft) {
            dragEndWidth = this.videoDisplayLeft + this.videoDisplayWidth - this.scanAreaDisplayLeft - 10;
                // -10 is to allow for CSS borders :-(
        }

        if (this.scanAreaDisplayTop + dragEndHeight > this.videoDisplayHeight + this.videoDisplayTop) {
            dragEndHeight = this.videoDisplayTop + this.videoDisplayHeight - this.scanAreaDisplayTop - 10;
                // -10 is to allow for CSS borders :-(
        }

        this.scanAreaDisplayWidth = dragEndWidth;
        this.scanAreaDisplayHeight = dragEndHeight;
        this.positionResizeHandle();
    }

    nextStep() {
        this.sesVideoScannerService.scanAreaDisplayTop = this.scanAreaDisplayTop;
        this.sesVideoScannerService.scanAreaDisplayLeft = this.scanAreaDisplayLeft;
        this.sesVideoScannerService.scanAreaDisplayWidth = this.scanAreaDisplayWidth + 10; // to allow for border
        this.sesVideoScannerService.scanAreaDisplayHeight = this.scanAreaDisplayHeight + 10; // to allow for border
        this.router.navigate(['/my-do-scan']);
    }

    positionResizeHandle() {
        this.resizeHandleLeft = this.scanAreaDisplayLeft + this.scanAreaDisplayWidth;
        this.resizeHandleTop = this.scanAreaDisplayTop + this.scanAreaDisplayHeight;
    }

    changeSlide(n: string) {
        localStorage.setItem('scanIncrement', n);
        this.sesVideoScannerService.scanIncrement = parseInt(n, 10);
    }

    getScanIncrementText() {
        switch (this.sesVideoScannerService.scanIncrement) {

            case 1:
                return 'Scan steps: High';
            case 2:
                return 'Scan steps: Medium';
            case 3:
                return 'Scan steps: Low';
        }

    }

}
