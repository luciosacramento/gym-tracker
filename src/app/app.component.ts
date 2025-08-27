import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
// ...imports iguais...
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span>Gym Tracker</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/">Hoje</a>
      <a mat-button routerLink="/progresso">Progresso</a>
      <a mat-button routerLink="/import">Importar XLSX</a>
    </mat-toolbar>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  // styles iguais...
})
export class AppComponent {}
