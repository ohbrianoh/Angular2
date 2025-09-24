import { Component, input } from '@angular/core';
import { HousingLocationInfo } from './housing-location-info';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.sass'
})
export default class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();

}
