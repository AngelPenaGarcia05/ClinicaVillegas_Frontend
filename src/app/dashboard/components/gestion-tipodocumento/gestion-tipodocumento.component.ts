import { Component, inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { TipoDocumento } from '../../../shared/interfaces/tipo-documento';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Pageable } from '../../../shared/interfaces/page';

@Component({
  selector: 'app-gestion-tipodocumento',
  imports: [ModalComponent, PaginationComponent, ReactiveFormsModule],
  templateUrl: './gestion-tipodocumento.component.html'
})
export class GestionTipodocumentoComponent {
  currentPageTipoDocumento: number = 0;
  totalPagesTipoDocumento: number = 1;
  paginatedTipoDocumentos: TipoDocumento[] = [];

  tipoDocumentoService = inject(TipoDocumentoService);
  toastService = inject(ToastrService);
  accionFormulario: string = '';
  trackedTipoDocumento!: TipoDocumento;

  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  busquedaForm = new FormGroup({
    busqueda: new FormControl('')
  });

  tipoDocumentoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    acronimo: new FormControl('', Validators.required),
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const params = this.getBusquedaParams();
    this.tipoDocumentoService.getTiposDocumento(params, false, this.currentPageTipoDocumento, 3)
      .subscribe((response) => {
        const responseFormat = response as Pageable<TipoDocumento>;
        this.totalPagesTipoDocumento = responseFormat.page.totalPages;
        this.paginatedTipoDocumentos = responseFormat.content;
      });
  }

  onPageChangeTipoDocumento(page: number): void {
    if (page < 0 || page >= this.totalPagesTipoDocumento) return;
    this.currentPageTipoDocumento = page;
    this.loadData();
  }

  onChangeTipoDocumento(event: Event) {
    const target = event.target as HTMLInputElement;
    const busqueda = target.value.trim();
    this.currentPageTipoDocumento = 0;
    this.loadData();
  }

  getBusquedaParams() {
    const nombre = this.busquedaForm.get('busqueda')?.value?.trim();
    return nombre ? { nombre } : {};
  }

  openModalToCreate() {
    this.tipoDocumentoForm.reset();
    this.accionFormulario = 'Agregar ';
    this.modal.open();
  }

  openModalUdpate(tipoDocumento: TipoDocumento) {
    this.accionFormulario = 'Editar ';
    this.trackedTipoDocumento = tipoDocumento;
    this.tipoDocumentoForm.patchValue({
      nombre: tipoDocumento.nombre,
      acronimo: tipoDocumento.acronimo,
    });
    this.modal.open();
  }

  openModalDelete(tipoDocumento: TipoDocumento) {
    this.accionFormulario = 'Eliminar ';
    this.trackedTipoDocumento = tipoDocumento;
    this.modalDelete.open();
  }

  registroTipoDocumento() {
    const data = {
      nombre: this.tipoDocumentoForm.get('nombre')?.value ?? '',
      acronimo: this.tipoDocumentoForm.get('acronimo')?.value ?? ''
    };
    this.tipoDocumentoService.agregarTipoDocumento(data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.modal.close();
        this.loadData();
      },
      error: (error) => {
        this.toastService.error('Error durante el registro: ' + error.message);
      }
    });
  }

  actualizarTipoDocumento(id: number) {
    const data = {
      nombre: this.tipoDocumentoForm.get('nombre')?.value ?? '',
      acronimo: this.tipoDocumentoForm.get('acronimo')?.value ?? ''
    };
    this.tipoDocumentoService.actualizarTipoDocumento(id, data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.modal.close();
        this.loadData();
      },
      error: (error) => {
        this.toastService.error('Error durante la actualización: ' + error.message);
      }
    });
  }

  eliminarTipoDocumento() {
    this.tipoDocumentoService.eliminarTipoDocumento(this.trackedTipoDocumento.id).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.modalDelete.close();
        this.loadData();
      },
      error: (error) => {
        this.toastService.error('Error durante el borrado: ' + error.message);
      }
    });
  }
}
