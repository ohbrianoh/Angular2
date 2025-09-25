import { Component, inject } from '@angular/core';
import HousingLocaltion from '../housing-location/housing-location';
import { Housing } from '../service/housing.service';
import { HousingLocationInfo } from '../housing-location/housing-location-info';
import { Details } from '../details/details';

@Component({
  selector: 'app-home',
  imports: [HousingLocaltion],
  templateUrl: './home.html',
  styleUrl: './home.sass'
})
export class Home {
  housingService: Housing = inject(Housing);
  housingLocationList: HousingLocationInfo[] = [];
  filteredLocationList: HousingLocationInfo[] = [];


  constructor() {
    this.housingService.getAllHousingLocations().subscribe((housingLocationList)=> 
    {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
    });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList.filter(
        housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
      );
    } else {
      this.filteredLocationList =this.housingLocationList;
    }
  }

}
