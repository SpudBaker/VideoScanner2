import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {RouterModule } from '@angular/router';
import {HttpModule, JsonpModule } from '@angular/http';
import {SelectVideoFilesComponent} from './selectVideoFiles/components/selectVideoFiles.component';
import {DefineVideoSizeAndStartPointComponent} from './defineVideoSizeAndStartPoint/components/defineVideoSizeAndStartPoint.component';
import {DefineScanAreaComponent} from './defineScanArea/components/defineScanArea.component';
import {DoScanComponent} from './doScan/components/doScan.component';
import {ShowResultsComponent} from './showResults/components/showResults.component';
import {HeaderComponent} from './header/components/header.component';
import {SettingsComponent} from './settings/components/settings.component';
import {SettingsFormComponent} from './settings/components/settingsForm.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        RouterModule.forRoot([
            { path: '', component: SelectVideoFilesComponent },
            { path: 'app-define-video-size-and-start-point', component: DefineVideoSizeAndStartPointComponent },
            { path: 'app-define-scan-area', component: DefineScanAreaComponent },
            { path: 'app-do-scan', component: DoScanComponent },
            { path: 'app-show-results', component: ShowResultsComponent },
            { path: 'app-settings', component: SettingsComponent }
        ])
    ],
    declarations: [
        AppComponent,
        SelectVideoFilesComponent,
        DefineVideoSizeAndStartPointComponent,
        DefineScanAreaComponent,
        DoScanComponent,
        ShowResultsComponent,
        HeaderComponent,
        SettingsComponent,
        SettingsFormComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
