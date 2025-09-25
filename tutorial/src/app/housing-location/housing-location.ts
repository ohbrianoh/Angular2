import { Component, Input } from '@angular/core';
import { HousingLocationInfo } from './housing-location-info';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.sass'
})
export default class HousingLocation {
  // housingLocation = input.required<HousingLocationInfo>(); // using signal

  // Use the @Input decorator for a standard property input.
  // The "!" tells TypeScript that this property will be initialized by Angular.
  @Input() housingLocation!: HousingLocationInfo;
}
