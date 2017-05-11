import {SESIncident} from '../../../src/app/model/SESIncident';


export class SESVideo {
    fileURL: Blob;
    fileName: string;
    duration: number;
    startPosition: number = 0; // the first video may include some setting up footage
    startPositionImage: any; // a static image used when defining the scan area
    scanned: boolean = false;
    scanning: boolean = false;
    incidents: SESIncident[];

    getIncidentCount() {
        return this.incidents.length;
    }

    constructor() {
        this.incidents = new Array();
    }

}
