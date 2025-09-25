# Angular 

## Angular Fundamentals
### cli
* `ng new <project-name>` [OK]
* `ng serve` [OK]
* `ng add` vs `npm install`
    - `ng add <lib>` to install lib and register to `angular.json`
    - `npm install` to install libs to `node_modules` and update `package.js`
* ng generate module
* ng generate component [OK]
* ng generate service [OK]
* ng generate pipe
* ng generate directive [OK]
* ng generate class 
* ng generate interface
* ng generate enum
* ng generate type


### Building Blocks

### Module vs Standalone
* module
    - app.module.vs
* standalone
    - app.config.ts

- DOM
### Directives
- *ng-for or @for
- *ng-if or @if
- *ng-switch or @switch



- Component: interacting between, parent-child,
- Lifecycle hooks


CSS
- Emulate DOM vs Shadow DOM
- 

## DI (Dependency Injection)
### @injectable and inject()
- Lazy load
- Optional injection (or restrict injection)
- Injectors

## State management: NGRX and Signal
- Life cycle
- Use case

## RxJS
- Asynchronous, Cache, react
- Observer vs observerable
- Hot vs Cold
- Subscribe multiple times
- Scheduler 

## HTTP Call
### async/wait (browser default) 
  ```
  async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
    try {
      const data = await fetch(this.url);
      this.housingLocationList = await data.json() ?? [];
      return this.housingLocationList;
    } catch(error){
      console.error('error: ', error);
      return [];
    }
  ```
### Observer/Observable(HttpClient/RxJS)
```
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
```
### Interceptor(middleware pattern)
```
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
```
## Pipe
- pure vs impure
- Interpolation is bad why? Perf?

## Performance 

## Testing
### Unit testing
- Karma/Jasmin
```
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
  
});
```
- TestBed: Testing environment
- TestBed.createComponent(..):ComponentFixture (Runtime objects)
- fixture.componentInstance (Testing component instance)
- fixture.navtiveElement (HTMLelement)
- fixture.debugElement
- fixture.detectChanges
- Functions
    - beforeEach(fn)
    - afterEach(fn)
    - beforeAll(fn)
    - afterAll(fn)
    - it(msg, fn)
- Assertions
    - expect()
- Testing Http
    - HttpTestingController: TestBed.inject(HttpTestingController)
    - httpClient = TestBed.inject(HttpClient)
    - provideHttpClient(withInterceptors([]))
    - provideHttpClientTesting()
    - spyOn().and.returnValue()
    - httpTestingConstoller.expectOne().flush()
    - httpTestingConstoller.verify()







### e2e

## Bundle/Packaging
Optimization/Performance
- Caching
- Rendering
- Split bundling
- PWA
- Memorize


## Linting


## Web Libs
- polyfill.js
- core-js
- zone.js
- rxjs


## Change Detection
- Strategy
- Tick?
