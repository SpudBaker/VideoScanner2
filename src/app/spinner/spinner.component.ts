import { Component } from '@angular/core';

@Component({
   selector: 'app-spinner',
   template: `
       <loaders-css [loader]="'ball-grid-pulse'" [loaderClass]="'app-spinner'"></loaders-css>
   `
})


export class SpinnerComponent {}