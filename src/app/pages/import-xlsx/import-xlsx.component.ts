import { Component } from '@angular/core';
import { ApiService, TrainingPlan } from '../../core/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-import-xlsx',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatSnackBarModule, MatCardModule, MatButtonModule,
    MatTableModule, MatIconModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './import-xlsx.component.html',
  styleUrls: ['./import-xlsx.component.scss']
})
export class ImportXlsxComponent {
  uploading = false;
  files: File[] = [];
  plans: TrainingPlan[] = [];
  loadingPlans = false;
  displayedColumns = ['id', 'name', 'count', 'start', 'end', 'actions'];

  constructor(private api: ApiService, private snack: MatSnackBar) {
    this.refreshPlans();
  }

  onFileChange(ev: any) {
    const sel: FileList = ev.target?.files;
    this.files = sel ? Array.from(sel) : [];
  }

  importAll() {
    if (!this.files.length) { this.snack.open('Selecione 1 ou mais .xlsx', 'OK', { duration: 2500 }); return; }
    this.uploading = true;
    this.api.uploadMultiple(this.files).subscribe({
      next: (resps) => {
        const names = resps.map(r => r?.planName || 'Treino').join(', ');
        this.snack.open(`Importado(s): ${names}`, 'OK', { duration: 4000 });
        this.files = [];
        this.uploading = false;
        this.refreshPlans();
      },
      error: (err) => {
        this.uploading = false;
        this.snack.open(`Erro ao importar: ${err?.error?.message || 'falha'}`, 'Fechar', { duration: 5000 });
      }
    });
  }

  refreshPlans() {
    this.loadingPlans = true;
    this.api.getPlans().subscribe({
      next: (list) => { this.plans = list; this.loadingPlans = false; },
      error: () => { this.loadingPlans = false; this.snack.open('Erro ao listar treinos', 'Fechar', { duration: 3000 }); }
    });
  }

  saveWeights(p: TrainingPlan) {
    this.api.updatePlanWeights(p.id, p.start_weight || null, p.end_weight || null).subscribe({
      next: () => this.snack.open('Pesos atualizados', 'OK', { duration: 2500 }),
      error: (err) => this.snack.open(`Erro ao salvar: ${err?.error?.message || 'falha'}`, 'Fechar', { duration: 4000 })
    });
  }

  deletePlan(p: TrainingPlan) {
    if (!confirm(`Remover o treino "${p.name}"? Exercícios e logs associados serão apagados.`)) return;
    this.api.deletePlan(p.id).subscribe({
      next: () => { this.snack.open('Treino removido', 'OK', { duration: 2500 }); this.plans = this.plans.filter(x => x.id !== p.id); },
      error: (err) => this.snack.open(`Erro ao remover: ${err?.error?.message || 'falha'}`, 'Fechar', { duration: 4000 })
    });
  }
}
