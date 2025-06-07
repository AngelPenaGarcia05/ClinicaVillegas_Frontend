import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccordionComponent, AccordionItem } from '../../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AccordionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  accordionItems: AccordionItem[] = [
    {
      title: "¿Cuándo debes cepillarte los dientes durante el día?",
      body: "Pasados ​​20 o 30 minutos después de las comidas principales, para permitir que la saliva neutralice la acidez de algunos alimentos, como los cítricos, el café y las bebidas carbonatadas. Se deben cepillar los dientes durante al menos dos minutos. Aquellos que sufren de inflamación de las encías deberían llegar a 4-5."
    },
    {
      title: "¿Qué alimentos ayudan a mantener los dientes limpios si tienes frenillos?",
      body: "La mayoría de los pacientes con frenillos tienen problemas para mantener los dientes limpios. Esto se debe a que los dientes se desgastan y se acumulan en los frenillos, lo que hace que los dientes se vuelvan más fríos y difíciles de limpiar. Para prevenir este problema, los dentistas recomiendan que los pacientes usen un producto de limpieza de dientes que se aplique regularmente, como un limpiador de dientes o un producto de limpieza de dientes. También es importante que los pacientes mantengan una dieta saludable y equilibrada, y que no se hagan cambios en la dieta durante la semana."
    },
    {
      title: "¿Cómo limpiar correctamente los dientes de los niños?",
      body: "Para limpiar correctamente los dientes de los niños, usa un cepillo de cerdas suaves y pasta dental con flúor. Cepilla suavemente dos veces al día, asegurándote de cubrir todas las superficies de los dientes y las encías. En niños menores de 3 años, usa una cantidad pequeña de pasta (tamaño de un grano de arroz) y supervisa siempre el cepillado. A partir de los 3 años, puedes usar una cantidad del tamaño de un guisante."
    },
    {
      title: "¿Los cepillos de dientes con cerdas duras proporcionan una limpieza más profunda?",
      body: "Los cepillos de dientes con cerdas duras proporcionan una limpieza más profunda. Esto se debe a que los cepillos de dientes con cerdas duras se usan para limpiar los dientes de los pacientes con frenillos, y se aplican regularmente para mantener los dientes limpios. Los cepillos de dientes con cerdas duras también se utilizan para limpiar los dientes de los pacientes con problemas de salud, como los pacientes con problemas de salud de la piel o los pacientes con problemas de salud de la piel."
    },
    {
      title: "¿Qué importancia tiene la higiene bucal para los fumadores?",
      body: "La higiene bucal es importante para los fumadores, ya que pueden tener problemas de salud de la piel y de la mucosa. Los fumadores pueden tener problemas de salud de la piel debido a que pueden tener problemas de salud de la piel debido a que pueden tener problemas de salud de la piel y de la mucosa. Los fumadores también pueden tener problemas de salud de la piel debido a que pueden tener problemas de salud de la piel y de la mucosa."
    }
  ];
  constructor(private router: Router){}

  redirectToBlog(){
    this.router.navigate(['home/blog']);
  }
}
