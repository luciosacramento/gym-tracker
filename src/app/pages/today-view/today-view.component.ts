import { Component, OnInit } from '@angular/core';
import { ApiService, TodayExercise, BulkLogItem, TrainingPlan, PlanMeta } from '../../core/api.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Row = TodayExercise & { currentWeight: string | null; sets: number; };

@Component({
  selector: 'app-today-view',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSnackBarModule, MatSelectModule
  ],
  templateUrl: './today-view.component.html',
  styleUrls: ['./today-view.component.scss']
})
export class TodayViewComponent implements OnInit {
  loading = false;
  rows: Row[] = [];
  displayedColumns = ['exercise', 'reps', 'lastWeight', 'currentWeight'];

  plans: TrainingPlan[] = [];
  selectedPlanId: number | null = null;
  planMeta?: PlanMeta;

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('gt.selectedPlanId');
    this.selectedPlanId = saved ? Number(saved) : null;
    this.loadPlans();
  }

  loadPlans() {
    this.api.getPlans().subscribe({
      next: (list) => {
        this.plans = list;
        if (!this.selectedPlanId && this.plans.length) {
          this.selectedPlanId = this.plans[0].id;
          localStorage.setItem('gt.selectedPlanId', String(this.selectedPlanId));
        }
        this.loadPlanMeta();
        this.fetch();
      },
      error: () => this.snack.open('Erro ao listar treinos', 'Fechar', { duration: 3000 })
    });
  }

  loadPlanMeta() {
    this.api.getPlanMeta(this.selectedPlanId ?? undefined).subscribe({
      next: meta => this.planMeta = meta,
      error: () => {}
    });
  }

  onChangePlan() {
    localStorage.setItem('gt.selectedPlanId', String(this.selectedPlanId ?? ''));
    this.loadPlanMeta();
    this.fetch();
  }

  private parseSets(repsSchema?: string | null): number {
    if (!repsSchema) return 3;
    const m = repsSchema.match(/(\d+)\s*x/i);
    return m ? parseInt(m[1], 10) : 3;
  }

  fetch() {
    this.loading = true;
    this.api.getTodayExercises(this.selectedPlanId ?? undefined).subscribe({
      next: (list) => {
        this.rows = list.map(e => ({
          ...e,
          currentWeight: (e.lastWeight ?? (e.suggestedWeight != null ? String(e.suggestedWeight) : null)),
          sets: this.parseSets(e.repsSchema)
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Erro ao carregar exercícios de hoje', 'Fechar', { duration: 4000 });
      }
    });
  }

  saveAll() {
    const items: BulkLogItem[] = [];
    this.rows.forEach(r => {
      const weight = (r.currentWeight ?? '').toString().trim() || null;
      for (let i = 1; i <= r.sets; i++) {
        items.push({ exerciseId: r.id, setIndex: i, weight });
      }
    });
    if (!items.length) { this.snack.open('Nada para salvar', 'OK', { duration: 2500 }); return; }

    this.api.saveBulkLogs(items).subscribe({
      next: (res:any) => {
        this.snack.open(`Treino salvo (${res.count} séries)`, 'OK', { duration: 3500 });
        this.fetch();
      },
      error: (err) => this.snack.open(`Erro ao salvar: ${err?.error?.message || 'falha'}`, 'Fechar', { duration: 4000 })
    });
  }
}
