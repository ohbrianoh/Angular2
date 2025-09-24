import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Housing } from '../housing.service'; 
import { HousingLocationInfo } from '../housing-location/housing-location-info';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.sass'
})
export class Details {
  // props
  route: ActivatedRoute = inject(ActivatedRoute); //inject singleton object
  housingService: Housing = inject(Housing);
  housingLocationId = -1;
  housingLocation = signal<HousingLocationInfo | undefined>(undefined);

  //define Form
  applyForm = new FormGroup({
    firstName: new FormControl(''), 
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(){
    const housingLocationId = Number(this.route.snapshot.params['id']); // details/:id
    this.housingService.getHousingLocationById(housingLocationId).then((location: HousingLocationInfo | undefined) => {
      console.log(`Fetched Location:`, location)
      this.housingLocation.set(location);
    }
    )

  }

  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '', //if null for the value, set '' as default
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }  

}