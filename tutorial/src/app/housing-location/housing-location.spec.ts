import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocaltion } from './housing-location';

describe('HousingLocaltion', () => {
  let component: HousingLocaltion;
  let fixture: ComponentFixture<HousingLocaltion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocaltion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocaltion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
