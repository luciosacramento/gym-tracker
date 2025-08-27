import { Component, OnInit } from '@angular/core';
import { ApiService, TrainingPlan } from '../../core/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-progress-view',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    NgChartsModule
  ],
  templateUrl: './progress-view.component.html',
  styleUrls: ['./progress-view.component.scss']
})
export class ProgressViewComponent implements OnInit {
  plans: TrainingPlan[] = [];
  selectedPlanId: number | null = null;
  exercises: { id: number; name: string; day_of_week: number; }[] = [];
  selectedExerciseId: number | null = null;
  loading = false;

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ data: [], label: 'Peso (numérico)', tension: 0.2, pointRadius: 3 }] };
  chartOptions: ChartConfiguration<'line'>['options'] = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: false } } };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const savedPlan = localStorage.getItem('gt.selectedPlanId');
    this.selectedPlanId = savedPlan ? Number(savedPlan) : null;
    this.loadPlans();
  }

  loadPlans() {
    this.api.getPlans().subscribe({
      next: list => {
        this.plans = list;
        if (!this.selectedPlanId && this.plans.length) this.selectedPlanId = this.plans[0].id;
        this.loadExercises();
      }
    });
  }

  loadExercises() {
    this.exercises = [];
    this.selectedExerciseId = null;
    if (!this.selectedPlanId) return;
    this.api.getExercisesByPlan(this.selectedPlanId).subscribe({
      next: list => { this.exercises = list; }
    });
  }

  loadHistory() {
    if (!this.selectedExerciseId) return;
    this.loading = true;
    this.api.getExerciseHistory(this.selectedExerciseId).subscribe({
      next: rows => {
        const labels: string[] = [];
        const data: number[] = [];
        rows.forEach(r => {
          labels.push(r.date);
          data.push(r.weight_num != null ? Number(r.weight_num) : NaN);
        });
        this.chartData = { labels, datasets: [{ data, label: 'Peso (numérico)', tension: 0.2, pointRadius: 3 }] };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
