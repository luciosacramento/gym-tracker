import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { TodayViewComponent } from './pages/today-view/today-view.component';
import { ImportXlsxComponent } from './pages/import-xlsx/import-xlsx.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: TodayViewComponent },
  { path: 'import', component: ImportXlsxComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent, TodayViewComponent, ImportXlsxComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule,
    MatInputModule, MatFormFieldModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
