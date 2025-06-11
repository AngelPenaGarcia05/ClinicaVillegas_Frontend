import { Component, CUSTOM_ELEMENTS_SCHEMA, input, signal, viewChild } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-report',
  imports: [ModalComponent, ChartComponent, CommonModule, DragDropModule],
  templateUrl: './dynamic-report.component.html',
  styleUrl: './dynamic-report.component.css'
})
export class DynamicReportComponent {
  modalFormat = viewChild<ModalComponent>('modalFormat');
  reportType = signal<string>('table');

  allFields = ['Business Type', 'Category', 'Color', 'Country', 'Price', 'Quantity'];
  filters: string[] = [];
  columns: string[] = [];
  rows: string[] = [];
  values: string[] = [];

  dropListIds = ['allFields', 'filters', 'columns', 'rows', 'values'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  setReportType(type: string) {
    this.reportType.set(type);
  }
  currentChartType = signal<'bar' | 'line' | 'pie'>('bar');

  // Computamos el próximo tipo para mostrar en el botón
  get nextChartType(): string {
    const types = ['bar', 'line', 'pie'];
    const current = this.currentChartType();
    return types[(types.indexOf(current) + 1) % types.length];
  }

  // Señal para los datos del gráfico
  chartData = signal({
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ventas 2023',
      data: [65, 59, 80, 81, 56],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  });

  // Opciones del gráfico (objeto estático)
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Ventas'
      }
    }
  };

  // Cambiar el tipo de gráfico
  toggleChartType() {
    const types = ['bar', 'line', 'pie'] as const;
    const currentIndex = types.indexOf(this.currentChartType());
    const nextIndex = (currentIndex + 1) % types.length;
    this.currentChartType.set(types[nextIndex]);
  }

  // Actualizar datos con valores aleatorios
  refreshData() {
    const newData = this.chartData().datasets[0].data.map(() =>
      Math.floor(Math.random() * 100)
    );

    this.chartData.set({
      ...this.chartData(),
      datasets: [{
        ...this.chartData().datasets[0],
        data: newData
      }]
    });
  }
}
