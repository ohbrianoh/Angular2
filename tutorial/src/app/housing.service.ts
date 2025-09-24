import { Injectable, inject } from '@angular/core';
import { HousingLocationInfo } from './housing-location/housing-location-info';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root' // Service Injection to root 
})
export class Housing {
  private http = inject(HttpClient); // Dependency Injection
  url = 'http://localhost:3000/locations';
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';
  housingLocationList: HousingLocationInfo[] = [];

  /* Method#1: using async/await (Browser default ES6)
  async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
    try {
      const data = await fetch(this.url);
      this.housingLocationList = await data.json() ?? [];
      return this.housingLocationList;
    } catch(error){
      console.error('error: ', error);
      return [];
    }
  

  async getHousingLocationById(id: number): Promise<HousingLocationInfo | undefined> {
    try {
      const data = await fetch(this.url + '?id=' + id)
      return   (await data.json())[0] ?? [];

    } catch(error){
      console.error('error: ', error);
      return undefined;
    }
  */

   // Method#2: using HttpClient which returns an Observable
  getAllHousingLocations(): Observable<HousingLocationInfo[]> {
    return this.http.get<HousingLocationInfo[]>(this.url);
  }
 
  getHousingLocationById(id: number): Observable<HousingLocationInfo | undefined> {
    // HttpClient can handle query parameters easily
    return this.http.get<HousingLocationInfo[]>(this.url, { params: { id: id.toString() } })
      .pipe(
        map(locations => locations[0])
      );
  }

  /** 
   * Submit 
   * */
  submitApplication(firstName: string, lastName:string, email:string) {
    console.log(
      `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
    );
    // Example of a POST request
    // return this.http.post(someUrl, { firstName, lastName, email });
  }
}
