import { Component, ViewEncapsulation } from '@angular/core';
import { GestionTipodocumentoComponent } from '../../components/gestion-tipodocumento/gestion-tipodocumento.component';
import { GestionTratamientoComponent } from '../../components/gestion-tratamiento/gestion-tratamiento.component';
import { GestionDentistasComponent } from '../../components/gestion-dentistas/gestion-dentistas.component';

@Component({
  selector: 'app-administrator',
  imports: [GestionTipodocumentoComponent, GestionTratamientoComponent, GestionDentistasComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="content-container flex-grow-1 p-4">
      <app-gestion-tipodocumento></app-gestion-tipodocumento>
      <app-gestion-tratamiento></app-gestion-tratamiento>
      <app-gestion-dentistas></app-gestion-dentistas>
    </div>
  `,
  styles: [`
    .content-container {
      flex-grow: 1;
      padding: 20px;
      max-width: none;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .content-container h4 {
      color: #022859;
    }

    .btn-blue {
      background-color: #022859;
      color: #ffffff;
      border: none;
    }

    .btn-blue:hover {
      background-color: #469beb;
    }
    .pagination{
      flex-wrap: wrap;
    }
    .pagination .page-item .page-link {
      color: #00485b;
      background-color: #ffffff;
      border: 1px solid #d4d4d4;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 0 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination .page-item .page-link:hover {
      background-color: #e9f6f7;
      border-color: #00485b;
    }

    .pagination .page-item .page-link.active {
      background-color: #022859;
      color: #ffffff;
      border-color: #022859;
      font-weight: bold;
    }

    .align-tables {
      table-layout: fixed;
      width: 100%;
    }
  `]
})
export class AdministratorComponent {

}
