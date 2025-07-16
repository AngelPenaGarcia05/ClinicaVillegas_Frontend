import { Component, inject, signal, viewChild } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ReportService } from '../../services/report.service';
import { ReporteRequestDTO } from '../../interfaces/reporte-request';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/interfaces/usuario';
import { AuthService } from '../../../auth/services/auth.service';
import { DentistaService } from '../../services/dentista.service';
import { TratamientoService } from '../../services/tratamiento.service';
import { TipoTratamientoService } from '../../services/tipo-tratamiento.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { Dentista } from '../../../shared/interfaces/dentista';
import { TipoTratamiento } from '../../../shared/interfaces/tipo-tratamiento';
import { TipoDocumento } from '../../../shared/interfaces/tipo-documento';
import { Tratamiento } from '../../../shared/interfaces/tratamiento';

@Component({
  selector: 'app-dynamic-report',
  imports: [ModalComponent, BaseChartDirective, ReactiveFormsModule],
  templateUrl: './dynamic-report.component.html',
  styleUrl: './dynamic-report.component.css'
})
export class DynamicReportComponent {
  tipoReporte = signal<string>('table');
  toastService = inject(ToastrService);
  authService = inject(AuthService);
  dentistaService = inject(DentistaService);
  tratamientoService = inject(TratamientoService);
  tipoTratamientoService = inject(TipoTratamientoService);
  tipoDocumentoService = inject(TipoDocumentoService);

  modalFormat = viewChild<ModalComponent>('modalFormat');
  modalConfig = viewChild<ModalComponent>('modalConfig');

  user$: Observable<Usuario | null>;

  reportData: any[] = [];
  columnas: string[] = [];
  chartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true }, title: { display: true, text: 'Reporte Gráfico' } }
  };


  configForm: FormGroup;
  camposDisponibles: Array<{ titulo: string, valor: string }> = [
    { titulo: 'Dentista', valor: 'dentista' },
    { titulo: 'Sexo', valor: 'sexo' },
    { titulo: 'Estado', valor: 'estado' },
    { titulo: 'Tratamiento', valor: 'tratamiento' },
    { titulo: 'Tipo de Tratamiento', valor: 'tipoTratamiento' },
    { titulo: 'Tipo de Documento', valor: 'tipoDocumento' }
  ];
  camposNumericos = ['id', 'monto'];
  agregaciones = ['conteo', 'suma', 'promedio', 'max', 'min'];
  opcionesDisponiblesPorFiltro: string[][] = [];

  constructor(private reporteService: ReportService, private fb: FormBuilder) {
    this.user$ = this.authService.fetchUser();
    this.configForm = this.fb.group({
      filas: ['tratamiento'],
      columnas: [''],
      valor: ['id'],
      agregacion: ['conteo'],
      fechaDesde: [''],
      fechaHasta: [''],
      filtros: this.fb.array([])
    })
    this.cargarReporte();
  }

  get filtros() {
    return this.configForm.get('filtros') as FormArray;
  }
  get filtrosFormGroups(): FormGroup[] {
    return this.filtros.controls as FormGroup[];
  }

  addFiltro() {
    this.filtros.push(this.fb.group({
      campo: [''],
      valor: ['']
    }));
    this.opcionesDisponiblesPorFiltro.push([]);
  }
  removeFiltro(index: number) {
    this.filtros.removeAt(index);
    this.opcionesDisponiblesPorFiltro.splice(index, 1);
  }
  cargarDatosDisponiblesPorFiltro(event: Event, index: number) {
    const target = event.target as HTMLSelectElement;
    const campo = target.value;

    switch (campo) {
      case 'dentista':
        this.dentistaService.obtenerDentistas({}, true).subscribe(dentistas => {
          this.opcionesDisponiblesPorFiltro[index] = (dentistas as Dentista[]).map(d => d.nombres);
        });
        break;
      case 'tipoTratamiento':
        this.tipoTratamientoService.getTipoTratamientos(undefined, true, true).subscribe(tipos => {
          this.opcionesDisponiblesPorFiltro[index] = (tipos as TipoTratamiento[]).map(t => t.nombre);
        });
        break;
      case 'tipoDocumento':
        this.tipoDocumentoService.getTiposDocumento({}, true).subscribe(tipos => {
          this.opcionesDisponiblesPorFiltro[index] = (tipos as TipoDocumento[]).map(t => t.nombre);
        });
        break;
      case 'sexo':
        this.opcionesDisponiblesPorFiltro[index] = ['MASCULINO', 'FEMENINO'];
        break;
      case 'estado':
        this.opcionesDisponiblesPorFiltro[index] = ['Pendiente', 'Atendida', 'Cancelada'];
        break;
      case 'tratamiento':
        this.tratamientoService.getTratamientos({}, true).subscribe(tratamientos => {
          this.opcionesDisponiblesPorFiltro[index] = (tratamientos as Tratamiento[]).map(t => t.nombre);
        });
        break;
      default:
        this.opcionesDisponiblesPorFiltro[index] = [];
    }
  }


  setTipoReporte(type: string) {
    this.tipoReporte.set(type);
  }


  cargarReporte() {
    const formValue = this.configForm.value;
    console.log(formValue)

    const dto: ReporteRequestDTO = {
      filas: [formValue.filas],
      columnas: formValue.columnas ? [formValue.columnas] : [],
      valor: formValue.valor,
      agregacion: formValue.agregacion,
      fechaDesde: formValue.fechaDesde,
      fechaHasta: formValue.fechaHasta,
      filtros: {}
    };
    if (!dto.filtros) {
      dto.filtros = {};
    }
    for (const f of formValue.filtros) {
      if (f.campo && f.valor) {
        dto.filtros[f.campo] = f.valor;
      }
    }
    this.reporteService.generarReporte(dto).subscribe(data => {
      this.reportData = data;
      this.columnas = Object.keys(data[0] || {});
      this.generarGrafico(data);
    });
  }

  generarGrafico(data: any[]) {
    const reportColors: string[] = [
      '#3B82F6', // azul
      '#F59E0B', // naranja
      '#10B981', // verde
      '#EF4444', // rojo
      '#8B5CF6', // violeta
      '#F472B6', // rosa
      '#0EA5E9', // celeste
    ];
    const etiquetas = data.map(row => row[this.columnas[0]]);
    const series = this.columnas.slice(1).map((col, index) => ({
      label: col,
      data: data.map(row => row[col] ?? 0),
      backgroundColor: reportColors[index % reportColors.length],
      borderColor: reportColors[index % reportColors.length],
      borderWidth: 1
    }));
    this.chartData = {
      labels: etiquetas,
      datasets: series
    };
  }

  descargar(formato: 'pdf' | 'excel'): void {
    if (formato === 'pdf') {
      this.descargarPdf();
    } else if (formato === 'excel') {
      this.descargarExcel();
    }
  }
  descargarPdf(): void {
    const formValue = this.configForm.value;
    const dto: ReporteRequestDTO = {
      filas: [formValue.filas],
      columnas: formValue.columnas ? [formValue.columnas] : [],
      valor: formValue.valor,
      agregacion: formValue.agregacion,
      fechaDesde: formValue.fechaDesde,
      fechaHasta: formValue.fechaHasta,
      filtros: {}
    };
    if (!dto.filtros) {
      dto.filtros = {};
    }
    for (const f of formValue.filtros) {
      if (f.campo && f.valor) {
        dto.filtros[f.campo] = f.valor;
      }
    }


    this.reporteService.descargarPdf(dto).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err) => {
        this.toastService.error('Error al descargar el PDF');
        console.error('Error al descargar el PDF:', err);
      }
    });
  }
  descargarExcel(): void {
    const formValue = this.configForm.value;
    const dto: ReporteRequestDTO = {
      filas: [formValue.filas],
      columnas: formValue.columnas ? [formValue.columnas] : [],
      valor: formValue.valor,
      agregacion: formValue.agregacion,
      fechaDesde: formValue.fechaDesde,
      fechaHasta: formValue.fechaHasta,
      filtros: {}
    };
    if (!dto.filtros) {
      dto.filtros = {};
    }
    for (const f of formValue.filtros) {
      if (f.campo && f.valor) {
        dto.filtros[f.campo] = f.valor;
      }
    }


    this.reporteService.descargarExcel(dto).subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastService.error('Error al descargar el Excel');
        console.error('Error al descargar el Excel:', err);
      }
    });
  }
}
