import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin } from 'rxjs';

export interface TodayExercise {
  id: number;
  name: string;
  repsSchema?: string | null;
  suggestedWeight?: number | null;
  lastWeight?: string | null;
}

export interface BulkLogItem {
  exerciseId: number;
  setIndex: number;
  weight?: string | null;
  reps?: number | null;
}

export interface TrainingPlan {
  id: number;
  name: string;
  start_weight?: string | null;
  end_weight?: string | null;
  created_at?: string;
  exercises_count?: number;
}

export interface PlanMeta {
  id: number;
  name: string;
  start_weight?: string | null;
  end_weight?: string | null;
  created_at?: string;
  weekNumber?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPlans(): Observable<TrainingPlan[]> {
    return this.http.get<TrainingPlan[]>(`${this.base}/training_plans_list.php`);
  }

  updatePlanWeights(planId: number, startWeight?: string | null, endWeight?: string | null): Observable<TrainingPlan> {
    return this.http.post<TrainingPlan>(`${this.base}/training_plans_update.php`, { planId, startWeight, endWeight });
  }

  deletePlan(planId: number): Observable<any> {
    return this.http.post(`${this.base}/training_plans_delete.php`, { planId });
  }

  getPlanMeta(planId?: number): Observable<PlanMeta> {
    let params = new HttpParams();
    if (planId != null) params = params.set('planId', String(planId));
    return this.http.get<PlanMeta>(`${this.base}/plan_meta.php`, { params });
  }

  getTodayExercises(planId?: number): Observable<TodayExercise[]> {
    let params = new HttpParams();
    if (planId != null) params = params.set('planId', String(planId));
    return this.http.get<TodayExercise[]>(`${this.base}/exercises_today.php`, { params });
  }

  getExercisesByPlan(planId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (planId != null) params = params.set('planId', String(planId));
    return this.http.get<any[]>(`${this.base}/exercises_by_plan.php`, { params });
  }

  getExerciseHistory(exerciseId: number): Observable<any[]> {
    const params = new HttpParams().set('exerciseId', String(exerciseId));
    return this.http.get<any[]>(`${this.base}/exercise_history.php`, { params });
  }

  uploadXlsx(file: File, planName?: string): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    if (planName) form.append('planName', planName);
    return this.http.post(`${this.base}/upload_xlsx.php`, form);
  }

  uploadMultiple(files: File[]): Observable<any[]> {
    const reqs = files.map(f => this.uploadXlsx(f));
    return forkJoin(reqs);
  }

  saveBulkLogs(items: BulkLogItem[], performedAt?: string) {
    return this.http.post(`${this.base}/logs_bulk.php`, { items, performedAt });
  }
}
