import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent implements AfterContentInit {

  @Input({ required: true }) formTracked!: FormGroup;
  @ContentChildren('step') stepTemplates!: QueryList<TemplateRef<any>>;
  steps: TemplateRef<any>[] = [];
  currentStep = 0;

  ngAfterContentInit(): void {
    this.steps = this.stepTemplates.toArray();
  }

  goToStep(step: number): void {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
    const formGroup = this.getCurrentFormGroup();
    if (formGroup) {
      formGroup.updateValueAndValidity();
    }
  }

  nextStep(): void {
    this.goToStep(this.currentStep + 1);
  }

  prevStep(): void {
    this.goToStep(this.currentStep - 1);
  }

  isStepValid(): boolean {
    const formGroup = this.getCurrentFormGroup();
    return formGroup ? formGroup.valid : false;
  }

  getCurrentFormGroup(): FormGroup | null {
    switch (this.currentStep) {
      case 0:
        return this.formTracked.get('tipo') as FormGroup;
      case 1:
        return this.formTracked.get('horario') as FormGroup;
      case 2:
        return this.formTracked.get('paciente') as FormGroup;
      default:
        return null;
    }
  }
}