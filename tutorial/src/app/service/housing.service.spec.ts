import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Housing } from './housing.service';
import { HousingLocationInfo } from '../housing-location/housing-location-info';

describe('HousingService', () => {
  let service: Housing;
  let httpTestingController: HttpTestingController;
  const mockUrl = 'http://localhost:3000/locations';

  // Mock data that matches the HousingLocationInfo interface
  const mockHousingLocations: HousingLocationInfo[] = [
    {
      id: 1,
      name: 'Test Home 1',
      city: 'Test City',
      state: 'TS',
      photo: 'test1.jpg',
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 2,
      name: 'Test Home 2',
      city: 'Test City',
      state: 'TS',
      photo: 'test2.jpg',
      availableUnits: 2,
      wifi: false,
      laundry: true, 
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ 
        imports: [HttpClientTestingModule], // for modules
        providers: [
            Housing, // Services should be in the providers array (for Standalone case)
            provideHttpClientTesting(),
        ],
    });

    // Inject the service and the mock HTTP controller
    service = TestBed.inject(Housing);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After each test, verify that there are no more pending requests. ??
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAllHousingLocations', () => {
    it('should return all housing locations via GET request', () => {
      service.getAllHousingLocations().subscribe(locations => {
        // Assert that the returned data matches the mock data
        expect(locations).toEqual(mockHousingLocations);
      });

      // Expect a single request to the specified URL
      const req = httpTestingController.expectOne(mockUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock data
      req.flush(mockHousingLocations);
    });
  });

  describe('#getHousingLocationById', () => {
    it('should return a single housing location by id', () => {
      const targetId = 1;
      const expectedLocation = mockHousingLocations[0];

      service.getHousingLocationById(targetId).subscribe(location => {
        expect(location).toEqual(expectedLocation);
      });

      // Expect a request with the correct URL and query parameter
      const req = httpTestingController.expectOne(`${mockUrl}?id=${targetId}`);
      expect(req.request.method).toEqual('GET');

      // The service expects an array in response, so we flush an array
      req.flush([expectedLocation]);
    });
  });

  describe('#submitApplication', () => {
    it('should log the application details to the console', () => {
      // Spy on console.log to track its calls
      spyOn(console, 'log');

      const testData = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@email.com' };
      service.submitApplication(testData.firstName, testData.lastName, testData.email);

      // Verify that console.log was called with the correct message
      expect(console.log).toHaveBeenCalledWith(
        `Homes application received: firstName: ${testData.firstName}, lastName: ${testData.lastName}, email: ${testData.email}.`
      );
    });
  });
});
