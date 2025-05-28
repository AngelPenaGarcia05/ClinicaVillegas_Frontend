import { Component } from '@angular/core';
import { BlogCardComponent, CardInfo } from '../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-blog',
  imports: [BlogCardComponent],
  template: `
    <div class="container-fluid p-3 p-md-4">
      <div class="row g-4">
        @for (card of cards; track $index) {
          <div class="blog-card col-12 col-sm-6 col-lg-4" [cardInfo]="card"></div>
        }
      </div>
    </div>
  `,
})
export class BlogComponent {

  cards: CardInfo[] = [
    {
      image: 'https://dentalprotect.cl/wp-content/uploads/2024/06/miniatura-malos-habitos-400-280.webp',
      title: 'Malos hábitos orales ¿qué son? ¿Cuáles son sus consecuencias?',
      description: 'Un hábito es una acción repetida que se realiza de forma automática, siendo patrones aprendidos de contracción muscular que en un principio se realizan de forma consciente y luego se transforman en un acto inconsciente e incluso difícil de controlar.',
      author: 'Clínica Dental Villegas'
    },
    {
      image: 'https://dentalprotect.cl/wp-content/uploads/2024/07/miniatura-edad-ortodoncia-400-280.webp',
      title: '¿A qué edad se colocan los brackets?',
      description: 'Para detectar de forma temprana alteraciones en la posición de los dientes o en el crecimiento de la mandíbula, es fundamental que los niños visiten al ortodoncista apenas inicie el recambio de los dientes de leche, es decir a los 6 años de edad.',
      author: 'Clínica Dental Villegas'
    },
    {
      image: 'https://dentalprotect.cl/wp-content/uploads/2024/04/morderse-las-unas.webp',
      title: 'Onicofagia – Morderse las uñas',
      description: 'El hábito de morderse las uñas, que también abarca la cutícula y los tejidos blandos, es común en niños y adultos jóvenes, y suele asociarse con la ansiedad. Esta práctica puede causar daño a los dientes debido a fracturas o desgaste en los incisivos.',
      author: 'Clínica Dental Villegas'
    },
    {
      image: 'https://dentalprotect.cl/wp-content/uploads/2024/04/respirador-bucal.webp',
      title: 'Respiración bucal – Malos hábitos orales',
      description: 'El síndrome de respirador bucal, puede afectar el desarrollo de las estructuras faciales y la posición de la lengua, lo que resulta en cambios musculares y posturales como un paladar elevado y una baja actividad en las mejillas. Esto influye significativamente en la salud oral y respiratoria.',
      author: 'Clínica Dental Villegas'
    },
    {
      image: 'https://dentalprotect.cl/wp-content/uploads/2023/08/cepillado-dental.webp',
      title: 'Caries y como Prevenirlas',
      description: 'La caries dental es una enfermedad causada por la acumulación de bacterias en la superficie dental, estas bacterias producen ácidos que corroen y dañan el esmalte de tus dientes. Esta enfermedad puede provocar la formación de cavidades en los dientes y la pérdida de la estructura dental.',
      author: 'Clínica Dental Villegas'
    },
    {
      image: 'https://dentalprotect.cl/wp-content/uploads/2024/04/succion-de-labio.webp',
      title: 'Succión del labio - Malos hábitos orales',
      description: 'Cuando el labio inferior se posiciona entre los dientes al tragar, hablar o estar en reposo, puede ocasionar separación excesiva entre los dientes superiores e inferiores, resultando en problemas como dientes separados o desalineados.',
      author: 'Clínica Dental Villegas'
    }
  ];
}
