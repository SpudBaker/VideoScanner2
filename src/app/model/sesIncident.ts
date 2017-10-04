export class SESIncident {
    time: string;
    image: any;  // stores the scan area image
    imagePrev1: any;  // stores the scan area image from the previous iteration
    imagePrev2: any; // stores the scan area image from two iterations ago
    imageTime: any;
    videoFileName: string; // stores the bottom left section which contains the time on Chris's camera
    displayState = 'inactive';

    getMinutes() {
        return Math.floor(parseInt(this.time, 10) / 60);
    }

    getSeconds() {
        return parseInt(this.time, 10) - (this.getMinutes() * 60);
    }

    constructor() {
    }

}
