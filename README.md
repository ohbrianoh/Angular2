# Angular 

## cli
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


## Module
* module
    - app.module.ts
* standalone
    - app.config.ts

## Component

## Template

## Directives
Directives are classes that add new behavior to elements in the template. There are two main types of directives in Angular.

### Structural Directives
These change the DOM layout by adding and removing DOM elements. The new `@` block syntax is preferred.

**`@if` (or `*ngIf`)**: Conditionally renders an element.
```html
@if (user.isLoggedIn) {
  <span>Welcome, {{ user.name }}</span>
} @else {
  <button (click)="login()">Log In</button>
}
```

**`@for` (or `*ngFor`)**: Renders an element for each item in an iterable. The `track` keyword is crucial for performance.
```html
<ul>
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  } @empty {
    <li>There are no items.</li>
  }
</ul>
```

**Custom Structural Directive**: You can create your own. Here is an `*appUnless` directive that shows an element if a condition is `false`.
```typescript
// unless.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, booleanAttribute } from '@angular/core';

@Directive({
  selector: '[appUnless]',
  standalone: true,
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input({ transform: booleanAttribute })
  set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

// app.module.ts
// This example assumes you are using NgModules. If your component is standalone,
// you would import `UnlessDirective` directly into your component's `imports` array.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UnlessDirective } from './unless.directive';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, UnlessDirective], // Import standalone directives
  declarations: [AppComponent], // Declare components
  bootstrap: [AppComponent],
})
export class AppModule {}

// app.component.html
<p *appUnless="isLoggedIn">
  This paragraph is only shown if 'isLoggedIn' is false.
</p>
```

### Attribute Directives
These change the appearance or behavior of an element, component, or another directive.

**`[ngClass]` and `[ngStyle]`**: Built-in directives to dynamically change classes and styles.
```html
<div [ngClass]="{ 'active': isActive, 'error': hasError }">...</div>
<div [ngStyle]="{ 'font-size.px': fontSize, 'color': 'blue' }">...</div>
```

**Custom Attribute Directive**: Here is a custom `appHighlight` directive that changes an element's background color on mouse hover.
```typescript
// highlight.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input('appHighlight') highlightColor = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

## State 
Component: interacting between, parent-child,
## Lifecycle hooks
Lifecycle hooks are methods on directives and components that Angular calls in a specific sequence as it creates, changes, and destroys them. They allow you to tap into these key moments to initialize data, perform actions when properties change, or clean up before destruction.

The most common hooks include:
- `ngOnChanges(changes: SimpleChanges)`: Called before `ngOnInit()` and whenever one or more data-bound input properties change.
- `ngOnInit()`: Called once, after the first `ngOnChanges()`. Best place for component initialization logic.
- `ngAfterViewInit()`: Called once after Angular initializes the component's views and child views.
- `ngOnDestroy()`: Called once, just before Angular destroys the directive or component. Used for cleanup to prevent memory leaks.

**Example:**
```typescript
import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-lifecycle-example',
  template: '<p>Hello, {{ name }}!</p>'
})
export class LifecycleExampleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() name: string;

  constructor() { console.log('1. constructor called'); }

  ngOnChanges(changes: SimpleChanges) { console.log('2. ngOnChanges called', changes); }

  ngOnInit() { console.log('3. ngOnInit called'); }

  ngOnDestroy() { console.log('4. ngOnDestroy called'); }
}
```

## Router
The Angular Router enables navigation between views.

**1. Configuration (`app.routes.ts`)**
Define routes by mapping a URL path to a component.
```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // The colon (:) makes 'id' a route parameter.
  { path: 'details/:id', component: DetailsComponent }
];
```

**2. Router Outlet (`app.component.html`)**
The `<router-outlet>` directive is a placeholder where Angular renders the routed component.
```html
<a routerLink="/">Home</a>
<router-outlet></router-outlet>
```

**3. Accessing Route Parameters (`details.component.ts`)**
Inject `ActivatedRoute` to get information about the current route, including parameters.
```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  template: '<p>Details for item ID: {{ itemId }}</p>'
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  itemId: number = -1;

  constructor() {
    this.itemId = Number(this.route.snapshot.params['id']);
  }
}
```

## View Encapsulation: CSS+DOM

Angular scopes component styles to prevent them from affecting other parts of the application. This is controlled by the `encapsulation` property in the `@Component` decorator.
- `ViewEncapsulation.Emulated` (Default): Angular adds unique attributes to the component's host element and CSS rules to emulate Shadow DOM.
- `ViewEncapsulation.ShadowDom`: Uses the browser's native Shadow DOM to create a "shadow root" for the component, providing complete style and DOM isolation. This prevents any styles from leaking in or out.
- `ViewEncapsulation.None`: Styles are global and can affect any element on the page.

```typescript
// shadow-dom-example.component.ts
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shadow-dom-example',
  standalone: true,
  template: `
    <h2>Shadow DOM Component</h2>
    <p>My styles are completely isolated!</p>
  `,
  styles: [`
    :host { display: block; border: 2px solid #ccc; padding: 1rem; margin-top: 1rem; }
    h2 {
      color: green;
      border: 2px solid green;
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ShadowDomExampleComponent {}
```
```html
<!-- app.component.html -->
<h2>I am a normal H2 element</h2>
<app-shadow-dom-example></app-shadow-dom-example>
```
*   The "I am a normal H2 element" will be **red with a dashed border** because it is affected by the global style.
*   The "Shadow DOM Component" `h2` will be **green with a solid border**. The global `red` style from `styles.css` cannot penetrate the Shadow DOM boundary, so only its own component styles are applied.

## Service (@Injectable)

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
### Pipe
- A simple way to transform data in your templates. 
- You can chain them together to build up more complex transformations. 
- built-in pipes: `DatePipe`, `DecimalPipe`, `LowerCasePipe`, `NumberPipe`, `TitleCasePipe`, `UpperCasePipe`, `CurrencyPipe` , `Async`
- **Pure Pipes** 
  - Default. only executed when Angular detects a "pure change" to its input.
  - For primitive inputs (like string, number, boolean), a pure change means the value itself has changed (e.g., from 5 to 10).
  - For object inputs (like Array, Object, Date), a pure change means the reference to the object has changed, not just a property within it.
  - This makes pure pipes very fast, as they don't run on every single change detection cycle. 
  - All built-in pipes are pure except for async.
  ```typescript
  // truncate.pipe.ts
  import { Pipe, PipeTransform } from '@angular/core';

  @Pipe({
    name: 'truncate',
    standalone: true, // Pipes can be standalone too!
  })
  export class TruncatePipe implements PipeTransform {
    // This transform method will only run if the `value` or `limit` changes.
    transform(value: string, limit: number = 20): string {
      console.log('Pure pipe is running!');
      return value.length > limit ? value.substring(0, limit) + '...' : value;
    }
  }
  ```
- **Impure Pipes**
  - executed during every component change detection cycle, regardless of whether the input value has changed. 
  - Useful when needs to handle changes inside a composite object. 
  - The built-in async pipe: a classic example of Impure pipe. It needs to check for new emissions from an `Observable`.
  - can cause performance issues if not used carefully.
  ```typescript
  // filter.pipe.ts
  //  Example: An Impure filter Pipe Imagine you want to filter a list but mutate the original 
  // array. A pure pipe wouldn't detect a new item being pushed. An impure pipe will.

  import { Pipe, PipeTransform } from '@angular/core';

  @Pipe({
    name: 'filter',
    standalone: true,
    pure: false, // This makes the pipe impure
  })
  export class FilterPipe implements PipeTransform {
    // This will run every time change detection runs
    transform(items: any[], filterFn: (item: any) => boolean): any[] {
      console.log('Impure pipe is running!');
      if (!items || !filterFn) {
        return items;
      }
      return items.filter(filterFn);
    }
  }

  ```




### Interpolation
* Syntex: `{{ }}`
* performance concern arises when you call a function or a complex getter inside an interpolation binding.
  * A method called from your template, like `{{ calculateTotal() }}`, will be executed on **every single change detection cycle**, which can be very frequent (on every mouse move, key press, etc.). If that function performs a heavy calculation, it can severely degrade your application's performance.

## Change Detection
- The process of synchronizing the application's state with the view.
- **Strategy**:
  - `Default`: Checks every component from top to bottom on every browser event.
  - `OnPush`: A performance optimization. A component is only checked if its `@Input`s change, an event originates from it, or it's manually marked for check.
    ```typescript
    import { Component, ChangeDetectionStrategy } from '@angular/core';

    @Component({
      selector: 'app-my-component',
      changeDetection: ChangeDetectionStrategy.OnPush,
      //...
    })
    export class MyComponent {}
    ```
- **Tick**: Refers to a turn of the JavaScript event loop. `zone.js` informs Angular to run change detection after a "tick" where an async operation completed. `ApplicationRef.tick()` can be used to manually trigger this process for the whole app.

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

- End-to-end testing simulates real user scenarios from start to finish.
- Protractor is deprecated. Modern choices are **Cypress** or **Playwright**.
- `ng add @cypress/schematic` to add Cypress.
- Example test:
  ```typescript
  describe('My App', () => {
    it('should display welcome message', () => {
      cy.visit('/');
      cy.contains('h1', 'Welcome');
    });
  });
  ```


## CI/CD
### Bundle/Packaging
Optimization/Performance
- **Caching**: The CLI adds content hashes to filenames (e.g., `main.a1b2c3d4.js`) for effective cache-busting.
- **Rendering**:
  - **SSR (Server-Side Rendering)** with Angular Universal (`ng add @angular/ssr`) for faster initial loads and better SEO.
  - **SSG (Static-Site Generation)** to pre-render pages at build time.
- **Split bundling / Lazy Loading**: Reduces initial bundle size by loading feature modules on demand.
  ```typescript
  // app-routing.module.ts
  const routes: Routes = [
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    }
  ];
  ```
- **PWA (Progressive Web App)**: Use `ng add @angular/pwa` to add a service worker and manifest for offline capabilities and a native-app feel.
- **Memoization**: An optimization technique. Pure pipes in Angular are a form of memoization, as they are only re-evaluated when their inputs change.

### Linting
- Analyzes code for programmatic and stylistic errors, ensuring code quality and consistency.
- Modern Angular uses **ESLint**.
- Run with `ng lint`.

### Web Libs
- **`polyfill.js`**: Imports scripts to support modern JavaScript features in older browsers.
- **`core-js`**: The library that provides the polyfills for ECMAScript features.
- **`zone.js`**: The core of Angular's automatic change detection. It patches async APIs (events, timers, promises) to notify Angular when to check for changes.
- **`rxjs`**: A reactive programming library using Observables, used extensively in Angular for handling async operations (e.g., `HttpClient`, Router, Reactive Forms).
- **`ngrx`**: 
