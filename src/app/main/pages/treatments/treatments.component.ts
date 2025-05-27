import { Component } from '@angular/core';
import { TreatmentCardComponent, TreatmentType } from "../../components/treatment-card/treatment-card.component";

@Component({
  selector: 'app-treatments',
  imports: [TreatmentCardComponent],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.css'
})
export class TreatmentsComponent {

  treatmentTypes: TreatmentType[] = [
  {
    title: 'Ortodoncia',
    description: `
      Esta especialidad tiene como fin el diagnóstico y tratamiento de las alteraciones 
      de la posición de los dientes y/o huesos maxilares. Por lo general, el tratamiento 
      implica la colocación de brackets y alambres delgados que tienen la función de alinear 
      los dientes y ajustar la mordida de manera ideal.
    `,
    treatments: [
      'Maloclusión I.II y III',
      'Brackets estéticos',
      'Brackets metálicos',
      'Brackets Lingual'
    ],
    imagePath: 'media/tipoortodoncia.jpg'
  },
  {
    title: 'Endodoncia',
    description: `
      Cuando la parte viva interna del cliente ha sido infectada a causa de caries profundas, el tratamiento de
      endodoncia implica limpiar y sellar los conductos dentales para salvar la pieza afectada. Luego es posible
      reconstruir la porción externa del diente.
    `,
    treatments: [
      'Endodoncia molares',
      'Retratamiento de endodoncias'
    ],
    imagePath: 'media/endodoncia-multirradicular.jpg'
  },
  {
    title: 'Cirugías',
    description: `
      Estas intervenciones son realizadas por cirujanos orales o maxilofaciales, profesionales especializados en el
      diagnóstico y tratamiento de afecciones que no pueden ser resueltas con tratamientos convencionales.
    `,
    treatments: [
      'Bichectomias',
      'Frenilectomias',
      'Muelas del jucio/cordales',
      'Supernumerario'
    ],
    imagePath: 'media/cirugiadental.jpg'
  },
  {
    title: 'Estética Dental',
    description: `
      Es una especialidad de la odontología que soluciona problemas relacionados con la salud bucal y la armonía
      estética de la boca en su totalidad.
    `,
    treatments: [
      'Diseño de sonrisa',
      'Carillas de zirconio',
      'Carillas de disilicato de litio',
      'Carillas con resina'
    ],
    imagePath: 'media/esteticadental2.jpg'
  }
]
}
