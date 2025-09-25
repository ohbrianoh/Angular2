import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { testingProviders } from '../testing/testing-providers';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, HttpClientTestingModule],
      providers: [
        provideRouter(routes),
        provideHttpClientTesting(),
      
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {  
    expect(component).toBeTruthy();
  });
});
