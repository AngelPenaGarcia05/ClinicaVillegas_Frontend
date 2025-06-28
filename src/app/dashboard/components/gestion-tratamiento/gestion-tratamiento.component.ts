import { Component, inject, ViewChild } from '@angular/core';
import { Tratamiento } from '../../../shared/interfaces/tratamiento';
import { TipoTratamiento } from '../../../shared/interfaces/tipo-tratamiento';
import { TratamientoService } from '../../services/tratamiento.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoTratamientoService } from '../../services/tipo-tratamiento.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Pageable } from '../../../shared/interfaces/page';

@Component({
  selector: 'app-gestion-tratamiento',
  imports: [ModalComponent, ReactiveFormsModule, PaginationComponent],
  templateUrl: './gestion-tratamiento.component.html',
  styleUrl: './gestion-tratamiento.component.css'
})
export class GestionTratamientoComponent {
  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 3;

  tratamientos: Tratamiento[] = [];
  tiposTratamiento: TipoTratamiento[] = [];

  tratamientoService = inject(TratamientoService);
  tipoTratamientoService = inject(TipoTratamientoService);
  toastService = inject(ToastrService);

  accionFormulario: 'Crear' | 'Editar' = 'Crear';
  trackedTratamiento!: Tratamiento;

  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  formBusqueda = new FormGroup({
    busqueda: new FormControl('')
  });

  formTratamiento = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    costo: new FormControl('', [Validators.required, Validators.min(0)]),
    tipoTratamientoId: new FormControl('', [Validators.required]),
    duracion: new FormControl('', [Validators.required]),
    imagenURL: new FormControl('')
  });

  ngOnInit(): void {
    this.loadTiposTratamiento();
    this.loadTratamientos();
  }

  loadTiposTratamiento(): void {
    this.tipoTratamientoService.getTipoTratamientos(undefined, true, true).subscribe(data => {
      this.tiposTratamiento = Array.isArray(data) ? data : data.content;
    });
  }

  loadTratamientos(): void {
    const nombre = this.formBusqueda.get('busqueda')?.value ?? '';
    this.tratamientoService.getTratamientos(
      nombre ? { nombre } : {},
      false,
      this.currentPage,
      this.pageSize
    ).subscribe(data => {
      if (data) {
        const dataFormat = data as Pageable<Tratamiento>;
        this.tratamientos = dataFormat.content;
        this.totalPages = dataFormat.page.totalPages;
      } else {
        this.tratamientos = data;
        this.totalPages = 1;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTratamientos();
  }

  onChangeBusqueda() {
    this.currentPage = 0;
    this.loadTratamientos();
  }

  openModalToCreate() {
    this.formTratamiento.reset();
    this.accionFormulario = 'Crear';
    this.modal.open();
  }

  openModalToUpdate(tratamiento: Tratamiento) {
    this.trackedTratamiento = tratamiento;
    this.accionFormulario = 'Editar';
    this.formTratamiento.patchValue({
      nombre: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      costo: tratamiento.costo.toString(),
      tipoTratamientoId: tratamiento.tipoTratamiento.id.toString(),
      duracion: this.convertirDuracionAMinutos(tratamiento.duracion).toString(),
      imagenURL: tratamiento.imagenURL
    });
    this.modal.open();
  }

  openModalToDelete(tratamiento: Tratamiento) {
    this.trackedTratamiento = tratamiento;
    this.modalDelete.open();
  }

  guardarTratamiento() {
    const payload = this.formTratamiento.value;
    this.tratamientoService.createTratamiento(payload).subscribe({
      next: msg => {
        this.toastService.success(msg);
        this.modal.close();
        this.loadTratamientos();
      },
      error: err => this.toastService.error(err.message)
    });
  }

  actualizarTratamiento() {
    const payload = this.formTratamiento.value;
    this.tratamientoService.updateTratamiento(this.trackedTratamiento.id, payload).subscribe({
      next: msg => {
        this.toastService.success(msg);
        this.modal.close();
        this.loadTratamientos();
      },
      error: err => this.toastService.error(err.message)
    });
  }

  eliminarTratamiento() {
    this.tratamientoService.deleteTratamiento(this.trackedTratamiento.id).subscribe({
      next: msg => {
        this.toastService.success(msg);
        this.modalDelete.close();
        this.loadTratamientos();
      },
      error: err => this.toastService.error(err.message)
    });
  }

  convertirDuracionAMinutos(duracion: string): number {
    const horas = /(\d+)H/.exec(duracion);
    const minutos = /(\d+)M/.exec(duracion);
    return (horas ? +horas[1] * 60 : 0) + (minutos ? +minutos[1] : 0);
  }
}
