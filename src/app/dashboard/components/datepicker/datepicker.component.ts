import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent implements OnInit {
  @Input() disabledDates: Date[] = [];
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  daysInMonth: Date[] = [];
  daysOfWeek: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  ngOnInit() {
    this.disabledDates = this.disabledDates.map(date => new Date(date));
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const days: Date[] = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const startDate = new Date(year, month, 1);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    this.daysInMonth = days;
  }

  selectDate(date: Date): void {
    if (!this.isDateDisabled(date)) {
      this.selectedDate = date;
      this.dateSelected.emit(date);
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  isDateDisabled(date: Date): boolean {
    const normalizeDate = (d: Date): string => 
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString();
  
    const normalizedDate = normalizeDate(date);
  
    const isInDisabledDates = this.disabledDates.some(d => normalizeDate(d) === normalizedDate);
  
    const isBeforeMinDate = this.minDate 
      ? date < new Date(this.minDate.setHours(0, 0, 0, 0)) 
      : false;
  
    const isAfterMaxDate = this.maxDate 
      ? date > new Date(this.maxDate.setHours(23, 59, 59, 999)) 
      : false;
  
    return isInDisabledDates || isBeforeMinDate || isAfterMaxDate;
  }
  
  

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }
}