import { ComponentFixture, TestBed } from '@angular/core/testing';
import HousingLocation from './housing-location';
import { testingProviders } from '../testing/testing-providers';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { routes } from '../app.routes';
import { HousingLocationInfo } from './housing-location-info';

describe('HousingLocation', () => {
  let component: HousingLocation;
  let fixture: ComponentFixture<HousingLocation>;

  // Create a mock housing location object
  const mockHousingLocation: HousingLocationInfo = {
    id: 99,
    name: 'Mock Test Home',
    city: 'Mock City',
    state: 'MS',
    photo: '',
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocation],
      providers: [
        provideRouter(routes),
        provideHttpClientTesting(),

      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocation);
    component = fixture.componentInstance;
    // Set the input property directly on the component instance
    component.housingLocation = mockHousingLocation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the housingLocation property set with mock data', () => {
    // Access it as a regular property
    expect(component.housingLocation).toEqual(mockHousingLocation);
  });
});
