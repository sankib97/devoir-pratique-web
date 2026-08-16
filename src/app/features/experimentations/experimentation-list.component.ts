import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Experimentation } from '../../core/models/experimentation.model';
import { ExperimentationService } from '../../core/services/experimentation.service';
import { DatasetService } from '../../core/services/dataset.service';
import { ModeleService } from '../../core/services/modele.service';
import { extractErrorMessage } from '../../core/utils/error.util';

interface OptionItem {
  label: string;
  value: number;
}

@Component({
  selector: 'app-experimentation-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputNumberModule, CalendarModule, DropdownModule, ToolbarModule, TagModule,
    TooltipModule, InputTextModule
  ],
  templateUrl: './experimentation-list.component.html',
  styleUrl: './experimentation-list.component.scss'
})
export class ExperimentationListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  experimentations: Experimentation[] = [];
  loading = true;

  datasetOptions: OptionItem[] = [];
  modeleOptions: OptionItem[] = [];

  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedId: number | null = null;
  submitting = false;

  form: FormGroup;

  constructor(
    private experimentationService: ExperimentationService,
    private datasetService: DatasetService,
    private modeleService: ModeleService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      datasetId: [null, [Validators.required]],
      modeleId: [null, [Validators.required]],
      accuracy: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      f1Score: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      dureeEntrainement: [null, [Validators.required, Validators.min(0)]],
      dateExecution: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadData();
  }

  private loadReferenceData(): void {
    forkJoin({
      datasets: this.datasetService.findAll(),
      modeles: this.modeleService.findAll()
    }).subscribe({
      next: ({ datasets, modeles }) => {
        this.datasetOptions = datasets.map(d => ({ label: d.nom, value: d.id! }));
        this.modeleOptions = modeles.map(m => ({ label: m.nom, value: m.id! }));
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: extractErrorMessage(err) });
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.experimentationService.findAll().subscribe({
      next: (data) => {
        this.experimentations = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: extractErrorMessage(err) });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openCreate(): void {
    this.dialogMode = 'create';
    this.selectedId = null;
    this.form.reset();
    this.dialogVisible = true;
  }

  openEdit(exp: Experimentation): void {
    this.dialogMode = 'edit';
    this.selectedId = exp.id ?? null;
    this.form.patchValue({
      datasetId: exp.datasetId,
      modeleId: exp.modeleId,
      accuracy: exp.accuracy,
      f1Score: exp.f1Score,
      dureeEntrainement: exp.dureeEntrainement,
      dateExecution: exp.dateExecution ? new Date(exp.dateExecution) : null
    });
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const raw = this.form.value;
    const payload: Experimentation = {
      datasetId: raw.datasetId,
      modeleId: raw.modeleId,
      accuracy: raw.accuracy,
      f1Score: raw.f1Score,
      dureeEntrainement: raw.dureeEntrainement,
      dateExecution: this.toIsoDate(raw.dateExecution)
    };

    const request$ = this.dialogMode === 'create'
      ? this.experimentationService.create(payload)
      : this.experimentationService.update(this.selectedId!, payload);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.dialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: this.dialogMode === 'create' ? 'Experimentation creee.' : 'Experimentation mise a jour.'
        });
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: extractErrorMessage(err) });
      }
    });
  }

  confirmDelete(exp: Experimentation): void {
    this.confirmationService.confirm({
      message: `Supprimer cette experimentation (${exp.datasetNom} / ${exp.modeleNom}) ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.performDelete(exp)
    });
  }

  private performDelete(exp: Experimentation): void {
    this.experimentationService.delete(exp.id!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Experimentation supprimee.' });
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: extractErrorMessage(err) });
      }
    });
  }

  private toIsoDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
