import { Component, inject, ViewChild } from '@angular/core';
import { Dentista } from '../../../shared/interfaces/dentista';
import { Usuario } from '../../../shared/interfaces/usuario';
import { DentistaService } from '../../services/dentista.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../services/usuario.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { response } from 'express';
import { Pageable } from '../../../shared/interfaces/page';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-gestion-dentistas',
  imports: [ModalComponent, PaginationComponent, ReactiveFormsModule],
  templateUrl: './gestion-dentistas.component.html',
  styleUrl: './gestion-dentistas.component.css'
})
export class GestionDentistasComponent {
  currentPageDentista: number = 0;
  totalPagesDentista: number = 0;
  paginatedDentistas: Dentista[] = [];

  currentPageUsuario: number = 0;
  totalPagesUsuario: number = 0;
  paginatedUsuarios: Usuario[] = [];

  dentistasService = inject(DentistaService);
  usuarioService = inject(UsuarioService);
  toastService = inject(ToastrService);

  usuarioTracked!: Usuario;
  dentistaTracked!: Dentista;
  accionFormlario: string = '';

  @ViewChild('modalCreate') modalCreate!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  dentistaForm = new FormGroup({
    nColegiatura: new FormControl('', [Validators.minLength(5), Validators.maxLength(5)]),
    especialidad: new FormControl('', Validators.required),
    usuarioId: new FormControl('', Validators.required),
  });

  dentistaBusqueda = new FormGroup({
    nombre: new FormControl('')
  });

  formEliminarDentista = new FormGroup({
    motivoCese: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    
    this.loadDentistas();
    this.loadUsuarios();
  }

  loadDentistas(): void {
    const nombre = this.dentistaBusqueda.get('nombre')?.value || '';
    this.dentistasService.obtenerDentistas({ nombre }, false, this.currentPageDentista, 3).subscribe((res) => {
      const resFormat = res as Pageable<Dentista>;
      this.paginatedDentistas = resFormat.content;
      this.totalPagesDentista = resFormat.page.totalPages;
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios({ rol: 'PACIENTE', estado: true }, false, this.currentPageUsuario, 3).subscribe((res) => {
      const resFormat = res as Pageable<Usuario>;
      this.paginatedUsuarios = resFormat.content;
      this.totalPagesUsuario = resFormat.page.totalPages;
    });
  }

  onPageChangeDentista(page: number): void {
    this.currentPageDentista = page;
    this.loadDentistas();
  }

  onPageChangeUsuario(page: number): void {
    this.currentPageUsuario = page;
    this.loadUsuarios();
  }

  onChangeDentista(): void {
    this.currentPageDentista = 0;
    this.loadDentistas();
  }

  setUsuarioTracked(usuario: Usuario) {
    this.usuarioTracked = usuario;
    this.dentistaForm.get('usuarioId')?.setValue(usuario.id.toString());
  }

  openModalToCreate() {
    this.accionFormlario = 'Nuevo dentista';
    this.dentistaForm.reset();
    this.dentistaForm.get('nColegiatura')?.enable();
    this.modalCreate.open();
  }

  openModalToEdit(dentista: Dentista) {
    this.accionFormlario = 'Editar dentista';
    this.dentistaTracked = dentista;
    console.log(this.dentistaTracked);
    this.dentistaForm.get('nColegiatura')?.disable();
    this.dentistaForm.patchValue({
      nColegiatura: dentista.ncolegiatura,
      especialidad: dentista.especializacion,
      usuarioId: dentista.usuarioId.toString()
    });
    this.modalCreate.open();
  }

  openModalToDelete(dentista: Dentista) {
    this.dentistaTracked = dentista;
    this.modalDelete.open();
  }

  registrarDentista() {
    const data = {
      ncolegiatura: this.dentistaForm.get('nColegiatura')?.value ?? '',
      especializacion: this.dentistaForm.get('especialidad')?.value ?? '',
      usuarioId: this.dentistaForm.get('usuarioId')?.value ?? ''
    };
    this.dentistasService.agregarDentista(data).subscribe({
      next: (res) => {
        this.toastService.success(res.mensaje);
        this.loadDentistas();
        this.loadUsuarios();
        this.modalCreate.close();
      },
      error: (err) => {
        this.toastService.error('Error durante el registro: ' + err.message);
      }
    });
  }

  editarDentista() {
    const data = {
      ncolegiatura: this.dentistaForm.get('nColegiatura')?.value ?? '',
      especializacion: this.dentistaForm.get('especialidad')?.value ?? '',
      usuarioId: this.dentistaForm.get('usuarioId')?.value ?? ''
    };
    this.dentistasService.actualizarDentista(this.dentistaTracked.id, data).subscribe({
      next: (res) => {
        this.toastService.success(res.mensaje);
        this.loadDentistas();
        this.loadUsuarios();
        this.modalCreate.close();
      },
      error: (err) => {
        this.toastService.error('Error durante la edición: ' + err.message);
      }
    });
  }

  eliminarDentista() {
    this.dentistasService.eliminarDentista(this.dentistaTracked.id, this.formEliminarDentista.get('motivoCese')?.value ?? '').subscribe({
      next: (res) => {
        this.toastService.success(res.mensaje);
        this.loadDentistas();
        this.loadUsuarios();
        this.modalDelete.close();
      },
      error: (err) => {
        this.toastService.error('Error al eliminar: ' + err.message);
      }
    });
  }
}
