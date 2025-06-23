import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  template: '<div class="chart-container"><canvas #mychart>{{chart}}</canvas></div>'
})
export class ChartComponent implements OnInit, OnChanges {

  @Input({ required: true }) public type!: string;
  @Input({ required: true }) public data!: any;
  @Input() public options: any;

  chart: Chart | null = null;

  @ViewChild('mychart', { static: true }) mychart!: ElementRef<HTMLCanvasElement>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['type'] || changes['options']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
    return;
  }
    if (!this.mychart || !this.mychart.nativeElement) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: this.type as any,
      data: this.data,
      options: this.options,
    };

    const canvasElement = this.mychart.nativeElement;
    if (canvasElement) {
      this.chart = new Chart(canvasElement, config);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
