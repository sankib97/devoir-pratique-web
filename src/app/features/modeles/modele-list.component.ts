import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ModeleML } from '../../core/models/modele.model';
import { TYPE_MODELE_OPTIONS } from '../../core/models/type-modele.enum';
import { ModeleService } from '../../core/services/modele.service';
import { extractErrorMessage } from '../../core/utils/error.util';

@Component({
  selector: 'app-modele-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, CalendarModule, DropdownModule, ToolbarModule, TagModule, TooltipModule
  ],
  templateUrl: './modele-list.component.html',
  styleUrl: './modele-list.component.scss'
})
export class ModeleListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  modeles: ModeleML[] = [];
  loading = true;

  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedId: number | null = null;
  submitting = false;

  typeOptions = TYPE_MODELE_OPTIONS;
  form: FormGroup;

  constructor(
    private modeleService: ModeleService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required]],
      type: [null, [Validators.required]],
      algorithme: ['', [Validators.required]],
      version: ['', [Validators.required]],
      dateCreation: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.modeleService.findAll().subscribe({
      next: (data) => {
        this.modeles = data;
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

  openEdit(modele: ModeleML): void {
    this.dialogMode = 'edit';
    this.selectedId = modele.id ?? null;
    this.form.patchValue({
      nom: modele.nom,
      type: modele.type,
      algorithme: modele.algorithme,
      version: modele.version,
      dateCreation: modele.dateCreation ? new Date(modele.dateCreation) : null
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
    const payload: ModeleML = {
      nom: raw.nom,
      type: raw.type,
      algorithme: raw.algorithme,
      version: raw.version,
      dateCreation: this.toIsoDate(raw.dateCreation)
    };

    const request$ = this.dialogMode === 'create'
      ? this.modeleService.create(payload)
      : this.modeleService.update(this.selectedId!, payload);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.dialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: this.dialogMode === 'create' ? 'Modele cree.' : 'Modele mis a jour.'
        });
        this.loadData();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: extractErrorMessage(err) });
      }
    });
  }

  confirmDelete(modele: ModeleML): void {
    this.confirmationService.confirm({
      message: `Supprimer le modele "${modele.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.performDelete(modele)
    });
  }

  private performDelete(modele: ModeleML): void {
    this.modeleService.delete(modele.id!).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Modele supprime.' });
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
