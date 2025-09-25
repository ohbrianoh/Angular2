import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Housing } from '../service/housing.service'; 
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
    //TODO handling Observable 1) Use RxJS pipe or subscribe 2) Convert to Promise (No good)
    const location$ = this.housingService.getHousingLocationById(housingLocationId);
    location$.subscribe((location)=>{
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