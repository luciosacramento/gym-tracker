import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TodayViewComponent } from './app/pages/today-view/today-view.component';
import { ImportXlsxComponent } from './app/pages/import-xlsx/import-xlsx.component';
import { ProgressViewComponent } from './app/pages/progress-view/progress-view.component';

const routes: Routes = [
  { path: '', component: TodayViewComponent },
  { path: 'import', component: ImportXlsxComponent },
  { path: 'progresso', component: ProgressViewComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule)
  ]
}).catch(err => console.error(err));
