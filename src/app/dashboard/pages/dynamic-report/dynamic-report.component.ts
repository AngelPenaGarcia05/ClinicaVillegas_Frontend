import { Component, inject, signal, viewChild } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ReportService } from '../../services/report.service';
import { ReporteRequestDTO } from '../../interfaces/reporte-request';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dynamic-report',
  imports: [ModalComponent, BaseChartDirective, ReactiveFormsModule],
  templateUrl: './dynamic-report.component.html',
  styleUrl: './dynamic-report.component.css'
})
export class DynamicReportComponent {
  tipoReporte = signal<string>('table');
  toastService = inject(ToastrService);

  modalFormat = viewChild<ModalComponent>('modalFormat');
  modalConfig = viewChild<ModalComponent>('modalConfig');

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

  constructor(private reporteService: ReportService, private fb: FormBuilder) {
    this.configForm = this.fb.group({
      filas: ['tratamiento'],
      columnas: [''],
      valor: ['id'],
      agregacion: ['conteo'],
      fechaDesde: ['2024-01-01'],
      fechaHasta: ['2024-12-31'],
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
  }
  removeFiltro(index: number) {
    this.filtros.removeAt(index);
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
    this.descargarPdf();
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
}
