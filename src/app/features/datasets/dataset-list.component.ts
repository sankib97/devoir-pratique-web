import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Dataset } from '../../core/models/dataset.model';
import { DATASET_FORMAT_OPTIONS } from '../../core/models/dataset-format.enum';
import { DatasetService } from '../../core/services/dataset.service';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-dataset-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, InputTextareaModule, InputNumberModule, CalendarModule,
    DropdownModule, ToolbarModule, TagModule, TooltipModule
  ],
  templateUrl: './dataset-list.component.html',
  styleUrl: './dataset-list.component.scss'
})
export class DatasetListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  datasets: Dataset[] = [];
  loading = true;

  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedId: number | null = null;
  submitting = false;

  formatOptions = DATASET_FORMAT_OPTIONS;
  form: FormGroup;

  constructor(
    private datasetService: DatasetService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required]],
      description: [''],
      source: [''],
      nombreObservations: [null, [Validators.required, Validators.min(0)]],
      format: [null, [Validators.required]],
      dateAjout: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.datasetService.findAll().subscribe({
      next: (data) => {
        this.datasets = data;
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

  openEdit(dataset: Dataset): void {
    this.dialogMode = 'edit';
    this.selectedId = dataset.id ?? null;
    this.form.patchValue({
      nom: dataset.nom,
      description: dataset.description,
      source: dataset.source,
      nombreObservations: dataset.nombreObservations,
      format: dataset.format,
      dateAjout: dataset.dateAjout ? new Date(dataset.dateAjout) : null
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
    const payload: Dataset = {
      nom: raw.nom,
      description: raw.description,
      source: raw.source,
      nombreObservations: raw.nombreObservations,
      format: raw.format,
      dateAjout: this.toIsoDate(raw.dateAjout)
    };

    const request$ = this.dialogMode === 'create'
      ? this.datasetService.create(payload)
      : this.datasetService.update(this.selectedId!, payload);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.dialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: this.dialogMode === 'create' ? 'Dataset cree.' : 'Dataset mis a jour.'
        });
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: extractErrorMessage(err) });
      }
    });
  }

  confirmDelete(dataset: Dataset): void {
    this.confirmationService.confirm({
      message: `Supprimer le dataset "${dataset.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.performDelete(dataset)
    });
  }

  private performDelete(dataset: Dataset): void {
    this.datasetService.delete(dataset.id!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Dataset supprime.' });
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
