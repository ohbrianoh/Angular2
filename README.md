# 1. Angular Fundamentals

## 1.1 CLI
* `ng new <project-name>` [OK]
* `ng serve --configuration <production>`
* `ng add` vs `npm install`
    - `ng add <lib>` to install lib and register to `angular.json`
    - `npm install` to install libs to `node_modules` and update `package.js`
* `ng generate` [module|component|service|pipe|directive|class|interface|enum|type|guard] _< name >_


## 1.2 Module vs Component

### Module (The "classic" way)

* a container for a block of code dedicated to an application domain or a set of related capabilities
* It configures the injector and the compiler and helps organize related things together.

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [ // The components, directives, and pipes that belong to this module
    AppComponent,
    HomeComponent
  ],
  imports: [ // Other modules whose exported classes are needed by component templates in this module.
    BrowserModule,
    HttpClientModule
  ],
  providers: [], // Creators of services that this module contributes to the global collection of services
  exports: [], //The subset of `declarations` that should be visible and usable in the component templates of other modules.
  bootstrap: [AppComponent] // The root component to start the app (only for root module)
})
export class AppModule { } // The root module that bootstraps your application.
```

### Standalone Components (The "modern" way)
* Angular v14 >=, `NgModule`s are optional. 
* Standalone components, directives, and pipes manage their own dependencies directly. 
* This simplifies the architecture
* Use cases: Smaller apps or shared libraries.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};

// app.module.ts
import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root', // The CSS selector that identifies this component in a template
  standalone: true,
  imports: [HomeComponent], // Import other standalone components, directives, or pipes
  template: `
    <main>
      <header class="brand-name">
        <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true">
      </header>
      <section class="content">
        <app-home></app-home>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
}
```

## 1.3 Template
Angular templates combine HTML with Angular-specific syntax to render dynamic views. 

### Inline vs. External Template 
- External Template (default): The template is in a separate HTML file, linked via templateUrl. This is best for complex views as it separates structure from logic.
- Inline Template: The template is embedded directly in the component's TypeScript file using backticks (`). This is convenient for small components with simple templates.

### Data Bindings
Data binding is the mechanism that connects your application's data (component properties) to the DOM, keeping them in sync. 
| Name | Type | Syntax | Description  | Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Interpolation** | One-way | `{{ data }}` | Displays a component property as text. Angular converts the value to a string.  </br> `<span>{{ user.name }}</span>` | Displaying simple text values from component properties. |
| **Property Binding** | One-way | `[property]="data"` | Binds an element's property (like `src` or `disabled`) to a component property.  </br> `<img [src]="imageUrl">` | Binding to non-string values like booleans, objects, or arrays. |
| **Event Binding** | One-way | `(event)="handler()"` | Listens for a DOM event (like `click`) and calls a component method.  </br> `<button (click)="save()">Save</button>` | Responding to user interactions like clicks, key presses, etc. |
| **Two-Way Binding** | Two-way | `[(property)]="data"` | Combines property and event binding to keep the view and component model in sync. </br> `<input [(ngModel)]="username" />` | Creating interactive forms where user input immediately updates the component's state. |






## 1.4 Pipe
- A simple way to transform data in your templates. 
- You can chain them together to build up more complex transformations. 
- built-in pipes: `DatePipe`, `DecimalPipe`, `LowerCasePipe`, `NumberPipe`, `TitleCasePipe`, `UpperCasePipe`, `CurrencyPipe` , `Async`
### Pure Pipes
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
### Impure Pipes
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

## 1.5 Directives
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
## 1.6 Form

### `ngModel` 
A directive that allows you to create a two-way data binding on form elements like `<input>`, `<textarea>`, and `<select>`. It's a core part of Angular's template-driven forms approach.
```html
<!-- This line -->
<input [(ngModel)]="username" />

<!-- Is just a shorthand for this: -->
<input [ngModel]="username" (ngModelChange)="username = $event" />
```


***Example:***
```typescript
// user-profile.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule], // ...and add it to the imports array
  template: `
    <h3>Two-Way Data Binding with ngModel</h3>
    
    <!-- 2. Bind to a component property -->
    <label for="username">Username:</label>
    <input id="username" type="text" [(ngModel)]="username" name="username" />

    <p>Current username is: <strong>{{ username }}</strong></p>
  `
})
export class UserProfileComponent {
  username: string = 'DefaultUser';
}
```

### ngModel vs. formControlName (Template-Driven vs. Reactive)

| Feature	| [(ngModel)] (Template-Driven) |	[formControl] or formControlName (Reactive) |
|:---|:---|:---|
| Primary Use	| Simple forms where most logic is in the template. |	Complex, scalable forms where logic and validation are defined in the component class. |
| Setup	| Import FormsModule.	| 	Import ReactiveFormsModule. |
| Data Flow	| Two-way ([(...)]).	Mostly one-way ([...]).	|  The form model is the source of truth. |
| Validation	| Uses template attributes like required, minlength.		| Defined programmatically using Validators in the component class. |
---
In your details.ts file, you use [formGroup]="applyForm" and formControlName="firstName". This is the Reactive Forms approach, which is generally more powerful and scalable for complex scenarios. ngModel is the simpler alternative for template-driven forms.



## 1.7 View: CSS+DOM

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

## 1.8 Router
The Angular Router enables navigation between views.

### Configuration (`app.routes.ts`)
Define routes by mapping a URL path to a component.
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // The colon (:) makes 'id' a route parameter.
  { path: 'details/:id', component: DetailsComponent },
  // using guard
  { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuard] },
  // redirect
  { path: '**', redirectTo: '' }
];
```

### Router Outlet (`app.component.html`)
```html
app.component.html

<a routerLink="/">Home</a> 
<router-outlet></router-outlet> <!-- placeholder where Angular renders the routed component -->
```

### Accessing Route Parameters (`details.component.ts`)

Inject `ActivatedRoute` to get information about the current route, including parameters.

```typescript
// details.component.ts
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

### Defining a guard 
```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    return true
  }
```
---


## 1.9 Dependency Injection

### @injectable and inject()
- Lazy load
- Optional injection (or restrict injection)
- Injectors

## State 
Component: interacting between, parent-child,

## Lifecycle hooks
Lifecycle hooks are methods on directives and components that Angular calls in a specific sequence as it creates, changes, and destroys them. They allow you to tap into these key moments to initialize data, perform actions when properties change, or clean up before destruction.

The most common hooks include:
- `ngOnChanges(changes: SimpleChanges)`: Called before `ngOnInit()` and whenever one or more data-bound input properties change.
- `ngOnInit()`: Called once, after the first `ngOnChanges()`. Best place for component initialization logic.
- `ngAfterViewInit()`: Called once after Angular initializes the component's views and child views.
- `ngOnDestroy()`: Called once, just before Angular destroys the directive or component. Used for cleanup to prevent memory leaks.

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

## 1.10 HTTP Call
### async/wait (Browser default) - No Callback Hell
  ```typescript
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

### HttpClient/RxJS

```typescript
getAllHousingLocations(): Observable<HousingLocationInfo[]> {
  return this.http.get<HousingLocationInfo[]>(this.url);
}

getHousingLocationById(id: number): Observable<HousingLocationInfo | undefined> {
  // HttpClient can handle query parameters easily
  return this.http.get<HousingLocationInfo[]>(this.url, { params: { id: id.toString() } })
    .pipe(
      retry(3), // <-- Retry the request up to 3 times on failure
      map(locations => locations[0]),
      // catchError must be at the end of the pipe to catch errors from all previous operators
      catchError(error => {
        console.error(`Error fetching housing location with id ${id}:`, error);
        // Return a safe value so the application can continue.
        // 'of' returns an Observable that emits a single value.
        return of(undefined);
      })
    );
}
```

## 1.11 Interceptor(middleware pattern)

```typescript
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


## 1.12Testing
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


---
# 2. Advanced Angular Topics

## 2.1 Compilation: JIT vs AOT

Convert  HTML templates and TypeScript component classes into efficient `JavaScript` code that the browser can execute to render the DOM

|  Feature	|  Just-in-Time (JIT)	| Ahead-of-Time (AOT) |
|:---|:---|:---|
| Compilation	| In the browser, at runtime. | During the build process, before deployment. |
| Bundle Size		| Larger (includes the Angular compiler).	| 	Smaller (compiler is not included). |
| Performance		| Slower initial load and rendering.		| Faster initial load and rendering. |
| Error Detection	| 	Template errors found at runtime.		| Template errors found at build time. |
| Security	| 	Less secure (templates evaluated at runtime).		| More secure (templates are pre-compiled). |
| Default		| No (Legacy)		| Yes (for both ng serve and ng build) |

## 2.2 Change Detection
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

### zone.js

A common question is: "How does Angular know to update the view when my observable emits a value?" The answer is `zone.js`.

1.  **Monkey-Patching**: When Angular starts, `zone.js` "monkey-patches" almost all standard asynchronous browser APIs, such as `setTimeout`, `setInterval`, `Promise`, and importantly, `XMLHttpRequest` (which `HttpClient` uses).

2.  **Entering the `NgZone`**: When an event handler in an Angular template is executed (like a `(click)`), the code "enters" Angular's zone (`NgZone`).

3.  **Async Task Registration**: If you trigger an async API from within this zone (e.g., you make an `HttpClient` request), `zone.js` intercepts this call. It registers the async task and then calls the original browser API.

4.  **Notification on Completion**: When the async task completes (e.g., the HTTP response arrives), the patched API notifies `NgZone` that it is finished.

5.  **Triggering Change Detection**: `NgZone` emits an `onMicrotaskEmpty` or `onStable` event. Angular's `ApplicationRef` listens for these events and triggers change detection for the entire application.

This is why, when your `HttpClient` observable emits a value and you update a component property, the view updates automatically. The entire process happens within the `NgZone`, and Angular is notified when it's time to check for changes.

### The `async` Pipe: Declarative Subscriptions

The `async` pipe is one of Angular's most powerful features for reactive programming. It subscribes to an `Observable` or `Promise` and returns the latest value it has emitted.

#### Key Benefits

1.  **Automatic Unsubscription**: It automatically unsubscribes when the component is destroyed, preventing memory leaks. This eliminates the need for manual unsubscription logic (e.g., using `takeUntil`).
2.  **Boilerplate Reduction**: It removes the need for `.subscribe()` calls and property assignments in your component's TypeScript file.
3.  **Change Detection Optimization**: When the observable emits a new value, the `async` pipe marks the component to be checked for changes. This works seamlessly with the `OnPush` change detection strategy.

**Example: Consuming the `UserService` with `async` pipe**

```typescript
// user-profile.component.ts
import { Component, inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  // Using the async pipe to directly bind observable streams to the template
  template: `
    @if (userService.isLoggedIn$ | async) {
      <div>Welcome, {{ (userService.user$ | async)?.name }}!</div>
      <button (click)="userService.logout()">Logout</button>
    } @else {
      <div>Please log in.</div>
      <button (click)="userService.login('Alice')">Login</button>
    }
  `
})
export class UserProfileComponent {
  // Inject the service. No .subscribe() or ngOnDestroy needed!
  public readonly userService = inject(UserService);
}
```

## 2.3 Common Component Reusable Across Apps


### Option 1: Create a **Shared Library** (Best Practice)

If you have multiple Angular apps in a **monorepo** (e.g., Nx, Lerna, or Angular Workspace with multiple projects), you can move your common component into a shared Angular library.

---

**Steps** 

1. **Generate a library** 

   ```bash
   ng generate library shared-ui
   ```
2. **Move your common component** (e.g., `HeaderComponent`) into the library: 

   ```
   projects/
     shared-ui/
       src/lib/header/
         header.component.ts
         header.component.html
   ```

3. **Export it** in the library module:

   ```ts
   @NgModule({
     declarations: [HeaderComponent],
     imports: [CommonModule],
     exports: [HeaderComponent]
   })
   export class SharedUiModule {}
   ```

4. **Build the library**

   ```bash
   ng build shared-ui
   ```

5. **Use it in any app**
   In another app’s module:

   ```ts
   import { SharedUiModule } from 'shared-ui';
   ```

   And in template:

   ```html
   <app-header></app-header>
   ```

---

### Option 2: Extract to a **Standalone Component Package**

Angular 15+ allows **standalone components**, so you can publish one component (or a few) as an independent npm package.

1. Mark your component as standalone:

   ```ts
   @Component({
     selector: 'app-header',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './header.component.html',
   })
   export class HeaderComponent {}
   ```

2. Create a `package.json` in that folder and publish it (or use local `file:` dependency).

3. Import it directly in consuming apps:

   ```ts
   import { HeaderComponent } from 'shared-header';
   ```

4. Use it:

   ```html
   <app-header />
   ```

---

### Option 3: Host via **Web Components** (Cross-Framework or Cross-Angular-Version)

If you need to share between totally separate Angular builds or even React/Vue apps — wrap it as a **custom element**:

```ts
import { createCustomElement } from '@angular/elements';
import { HeaderComponent } from './header.component';
import { Injector } from '@angular/core';

const el = createCustomElement(HeaderComponent, { injector });
customElements.define('shared-header', el);
```

Then in any web page (even non-Angular):

```html
<script src="shared-header.bundle.js"></script>
<shared-header></shared-header>
```

---

### Option 4: Private npm / Git Package

You can also bundle and publish your shared library to:

* a private npm registry
* or directly import via GitHub or file path:

  ```bash
  npm install git+https://github.com/yourorg/shared-ui.git
  ```

---

### 💡 Tip

If you’re planning multiple shared elements (UI, services, pipes, guards), organize them by domain:

```
shared/
  ui/
  pipes/
  services/
  directives/
```

---

## 2.4 Optimization/Performance

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

* performance concern arises when you call a function or a complex getter inside an interpolation binding.
  * A method called from your template, like `{{ calculateTotal() }}`, will be executed on **every single change detection cycle**, which can be very frequent (on every mouse move, key press, etc.). If that function performs a heavy calculation, it can severely degrade your application's performance.


## Others [TBD]
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

---

# 3. JavaScript/TypeScript Memory and Concurrency Model

At its core, JavaScript has a very specific runtime model:

*   **Single-threaded**: It has one call stack and one memory heap. This means it can only do one thing at a time.
*   **Non-blocking I/O**: It uses an **event loop** to handle asynchronous operations (like network requests, timers, or file I/O) without freezing the main thread.

TypeScript, being a superset of JavaScript, compiles down to JavaScript. Therefore, it shares the exact same runtime memory and concurrency model. TypeScript's type system helps you manage the complexity at compile-time, but the runtime behavior is pure JavaScript.

## 3.1 The Memory Model: Stack and Heap

JavaScript's memory is divided into two main areas:

*   **The Stack**: This is where static data, including primitive values (like `number`, `string`, `boolean`) and references (pointers) to objects, are stored. It's a LIFO (Last-In, First-Out) data structure. When a function is called, a "stack frame" is created for it, holding its local variables. When the function returns, its frame is popped off the stack. This is very fast.

*   **The Heap**: This is a large, unstructured region of memory where all objects (including arrays, functions, and of course, `object` literals) are stored. When you create an object, memory is allocated on the heap, and a reference to that memory location is stored on the stack.

```javascript
function processUser(id) {
  const name = "Alice"; // 'name' (primitive) is on the stack
  const user = {        // 'user' (reference) is on the stack
    id: id,            // The object it points to is on the heap
    name: name
  };
  return user;
}

processUser(123);
```
In this example:
1.  `processUser(123)` is called, a stack frame is created.
2.  The primitive `id` (123) and `name` ("Alice") are stored in the stack frame.
3.  The `user` object is created in the heap.
4.  The variable `user` on the stack holds the memory address (reference) of the object in the heap.

### Garbage Collection
Because memory is allocated on the heap, it must be cleaned up. JavaScript uses an automatic garbage collector. The most common algorithm is **"Mark-and-Sweep"**. It periodically starts from a set of "roots" (like global variables and the current call stack) and traverses all object references to find all *reachable* objects. Any object that is not reachable is considered "garbage" and the memory it occupies is reclaimed.

## 3.2 The Concurrency Model: The Event Loop

Since JavaScript is single-threaded, how does it handle tasks like `setTimeout` or fetching data from a server without stopping everything? The answer is the **Event Loop**.

The JavaScript runtime environment consists of more than just the engine (which has the Stack and Heap). It also includes Web APIs (in the browser) or C++ APIs (in Node.js) and a couple of queues.

1.  **Call Stack**: As we saw, this is where function calls are executed.
2.  **Web APIs / C++ APIs**: These are provided by the environment (browser/Node.js), not the JS engine. When you call an asynchronous function like `setTimeout(myCallback, 1000)`, the JS engine doesn't handle the timer. It hands `myCallback` and the delay over to the browser's timer API and immediately moves on.
3.  **Task Queue (or Macrotask Queue)**: When the browser's timer finishes, it doesn't interrupt the JS code. Instead, it places `myCallback` into the Task Queue.
4.  **Microtask Queue**: This queue is for promises (`.then()`, `.catch()`, `.finally()`) and `queueMicrotask`. It has a higher priority than the Task Queue.
5.  **Event Loop**: This is a simple process with one job: to continuously check if the **Call Stack is empty**.
    *   If the Call Stack is empty, it first checks the **Microtask Queue**. If there are any tasks, it moves them one by one to the Call Stack to be executed until the Micro-gittask Queue is empty.
    *   Only then, if the Call Stack is still empty, does it take the oldest task from the **Task Queue** and move it to the Call Stack for execution.

This model ensures that long-running operations don't block the main thread, keeping the UI responsive.

```javascript
console.log('1. Start');

// This is a Macrotask, handled by a Web API
setTimeout(() => {
  console.log('4. Timeout (Macrotask)');
}, 0);

// This is a Microtask
Promise.resolve().then(() => {
  console.log('3. Promise (Microtask)');
});

console.log('2. End');

// Output:
// 1. Start
// 2. End
// 3. Promise (Microtask)
// 4. Timeout (Macrotask)
```
**Why this order?**
1.  `console.log('1. Start')` runs.
2.  `setTimeout` is handed to the Web API.
3.  `Promise.resolve().then()`'s callback is placed in the Microtask Queue.
4.  `console.log('2. End')` runs.
5.  The initial script is done, the Call Stack is empty.
6.  The Event Loop checks the Microtask Queue. It finds the promise callback and runs it, logging `3. Promise (Microtask)`.
7.  The Microtask Queue is now empty. The Event Loop checks the Task Queue. It finds the `setTimeout` callback (which the Web API placed there after 0ms) and runs it, logging `4. Timeout (Macrotask)`.

## 3.3 True Parallelism: Web Workers

The Event Loop provides *concurrency* (handling multiple things over time), not *parallelism* (doing multiple things at the same time). For true parallelism, you can use **Web Workers**.

*   A Web Worker runs a script in a separate background thread.
*   This is useful for CPU-intensive tasks like complex calculations, image processing, or parsing large data files, as it won't block the main UI thread.
*   **Crucially, workers have their own separate memory heap and call stack.** They do not share memory with the main thread or other workers.
*   Communication is done by passing messages using `postMessage()` and listening for them with an `onmessage` event handler. The data is copied (serialized and deserialized), not shared.

This message-passing model prevents race conditions and makes multi-threaded programming in JavaScript safer than in languages with shared-memory threading.

```javascript
// main.js
const worker = new Worker('worker.js');

// Send a message to the worker
worker.postMessage({ number: 40 });

// Listen for messages from the worker
worker.onmessage = function(e) {
  console.log('Result from worker:', e.data); // Result from worker: 102334155
};

// worker.js
onmessage = function(e) {
  // Perform a heavy calculation
  const result = fibonacci(e.data.number);
  // Send the result back to the main thread
  postMessage(result);
};

function fibonacci(num) {
  // a slow, recursive implementation
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}
```


---

# 4. Reactive Programming in Angular


This guide provides a comprehensive, production-grade overview of reactive programming concepts in Angular using RxJS. It is organized to build from foundational knowledge to advanced, practical application, making it an ideal resource for learning and interview preparation.


## 4.1 Reactive Programming in Angular

Reactive programming is a **declarative programming** paradigm concerned with **asynchronous data streams** and the propagation of change. In simpler terms, it's a way of building applications where you define how different parts of your system react to new data or events over time.

Angular is built with reactive principles in mind and uses **RxJS** as its primary tool for handling asynchronicity.

*   **RxJS Integration**: RxJS is a first-class citizen in Angular. You'll find Observables used throughout the framework:
    *   **`HttpClient`**: All HTTP methods return Observables to handle asynchronous network requests.
    *   **Router**: Events like navigation start and end are exposed as an Observable stream (`router.events`).
    *   **Reactive Forms**: The `valueChanges` and `statusChanges` properties on form controls are Observables that emit whenever the form's state changes.

*   **The `async` Pipe**: This is Angular's most powerful tool for working with Observables in templates. It subscribes to an Observable, returns the latest value it has emitted, and automatically unsubscribes when the component is destroyed, preventing common memory leaks.

*   **`zone.js` and Change Detection**: Angular uses `zone.js` to automatically trigger change detection in response to asynchronous operations. When an Observable from `HttpClient` emits a value or a `setTimeout` within a `delay` operator completes, `zone.js` notifies Angular that an async task has finished, and Angular runs change detection to update the view with the new data.


## 4.2 RxJS(Reactive Extensions for JavaScript)

### Observable/Oberserver
*   **Observable**: Represents a stream of data that can be subscribed to. It can emit zero or more values over time, and can also signal an error or completion. Think of it as a lazy "push" collection.
*   **Observer**: The consumer of `Observerable`. It's an object with three optional methods: `next(value)` for each value emitted, `error(err)` if an error occurs, and `complete()` when the stream finishes.
*   **Subscription**: Represents the execution of an Observable. It's primarily used for unsubscribing to free up memory and prevent unwanted behavior.
*   **Operators**: Pure functions that enable a functional, declarative approach to composing streams. They allow you to transform, filter, combine, and manipulate data streams with ease (e.g., `map`, `filter`, `mergeMap`).
*   **Scheduler**: A powerful mechanism that controls when a subscription starts and when notifications are delivered. It allows you to manage concurrency and decide, for example, if an operation should happen synchronously, on a macrotask (like `setTimeout`), or on a microtask (like `Promise`).


### Hot vs. Cold Observables

The main distinction lies in **when the producer is created** and **how the values are shared** among subscribers.

| **Type** | **Casting** | **Features** | **Examples** |
| :--- | :--- | :--- | :--- |
| **Cold Observable** | Unicast (one-to-one). | Lazy, inside-producer | `of()`, `from()`, `range()`, `interval()`, `HttpClient`|
| **Hot Observable** | Multicast (one-to-many). |Active, outside-producer | `fromEvent()`, `Subject`s |
---
*   **Lazy**: The producer doesn't start emitting values until the first subscription.
*   **Unicast**: Each subscriber gets its own independent stream of values from the beginning.
*   **Active**: The producer is always running, regardless of subscribers.
*   **Multicast**: The producer's values are shared among all subscribers.

---
### Cold Observables


```typescript
import { interval } from 'rxjs';

// Create a cold observable that emits every 1000ms
const coldObservable = interval(1000);

console.log('Subscribing first subscriber...');
coldObservable.subscribe(value => {
console.log(`Subscriber 1: ${value}`);
});

// After 3 seconds, add a second subscriber
setTimeout(() => {
console.log('Subscribing second subscriber...');
coldObservable.subscribe(value => {
    console.log(`Subscriber 2: ${value}`);
});
}, 3000);

/*
OUTPUT:
Subscribing first subscriber...
Subscriber 1: 0
Subscriber 1: 1
Subscriber 1: 2
Subscribing second subscriber...
Subscriber 1: 3
Subscriber 2: 0  <-- Notice it starts from 0
Subscriber 1: 4
Subscriber 2: 1
...and so on
*/
```

### Hot Observables

```typescript
import { fromEvent, tap } from 'rxjs';

// Create a hot observable from document clicks
const hotObservable = fromEvent(document, 'click').pipe(
// We add a tap operator to see when the source emits
tap(() => console.log('Source emitted a click!'))
);

console.log('Subscribing first subscriber...');
hotObservable.subscribe(event => {
console.log(`Subscriber 1: Clicked at (${event.clientX}, ${event.clientY})`);
});

// After 5 seconds, add a second subscriber
setTimeout(() => {
console.log('Subscribing second subscriber...');
hotObservable.subscribe(event => {
    console.log(`Subscriber 2: Clicked at (${event.clientX}, ${event.clientY})`);
});
}, 5000);

/*
OUTPUT (after user clicks):

// User clicks once before 5 seconds
Subscribing first subscriber...
Source emitted a click!
Subscriber 1: Clicked at (123, 456)

// After 5 seconds, the second subscriber joins
Subscribing second subscriber...

// User clicks again
Source emitted a click!
Subscriber 1: Clicked at (789, 101)
Subscriber 2: Clicked at (789, 101) <-- Both get the same event
*/
```

### Converting Cold to Hot (Multicasting)

Sometimes you have a Cold observable (like an HTTP request) but you want all subscribers to share the single result instead of triggering a new request for each one. You can make a Cold observable behave like a Hot one using **multicasting operators**.

The most common are `share()` and `shareReplay()`.

*   `share()`: Shares a single subscription to the underlying source for all subscribers. It subscribes when the first subscriber arrives and unsubscribes when the last one leaves.
*   `shareReplay(bufferSize)`: Similar to `share()`, but it can also "replay" the last `bufferSize` emissions to new subscribers. This is extremely useful for caching results.

```typescript
import { interval, share, tap } from 'rxjs';

// Create a cold observable...
const coldSource = interval(1000).pipe(
  tap(value => console.log(`Source emitted: ${value}`))
);

// ...and make it hot!
const hotObservable = coldSource.pipe(share());

console.log('Subscribing first subscriber...');
hotObservable.subscribe(value => {
  console.log(`Subscriber 1: ${value}`);
});

// After 3 seconds, add a second subscriber
setTimeout(() => {
  console.log('Subscribing second subscriber...');
  hotObservable.subscribe(value => {
    console.log(`Subscriber 2: ${value}`);
  });
}, 3000);

/*
OUTPUT:
Subscribing first subscriber...
Source emitted: 0
Subscriber 1: 0
Source emitted: 1
Subscriber 1: 1
Source emitted: 2
Subscriber 1: 2
Subscribing second subscriber...
Source emitted: 3
Subscriber 1: 3
Subscriber 2: 3  <-- Notice it "jumps in" and gets the shared value
Source emitted: 4
Subscriber 1: 4
Subscriber 2: 4
...and so on
*/
```

### RxJS Subjects

* While operators like `share()` can make a Cold observable Hot, the most common way to create a multicast (Hot) observable is by using a `Subject`.
* A special type of Observable: Allows values to be multicasted to many Observers
* Plain Observables are unicast vs Subjects are multicast.
* A Subject is both an Observable and an Observer: You can subscribe to it, and you can call `next(value)`, `error(err)`, and `complete()` on it.
* A Subject is like an `EventEmitter`: it maintains a registry of many listeners. 

---

| Subject | Initial Value | Replays | On Subscribe |
| :--- | :--- | :--- | :--- |
| **Subject** | No | No | Receives values emitted *after* subscription. |
| **BehaviorSubject** | Yes | Yes (1) | Immediately receives the *current* value. ideal for representing "values over time," such as state in an application |
| **ReplaySubject** | No | Yes (n) | Immediately receives the last `n` values. can "replay" or emit old values to new subscribers. It records a part of the observable execution and sends it to new subscribers. You can configure how many values to buffer and for how long.|
| **AsyncSubject** | No | Yes (1) | Receives the *last* value only on completion. |
---

```typescript
// Subject
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe(value => console.log(`Subscriber A: ${value}`));

subject.next(1); // Subscriber A: 1
subject.next(2); // Subscriber A: 2

subject.subscribe(value => console.log(`Subscriber B: ${value}`));

subject.next(3); // Subscriber A: 3, Subscriber B: 3
```


```typescript
// BehaviorSubject

import { BehaviorSubject } from 'rxjs';

// Requires an initial value
const subject = new BehaviorSubject<number>(0);

subject.subscribe(value => console.log(`Subscriber A: ${value}`)); // Subscriber A: 0

subject.next(1); // Subscriber A: 1
subject.next(2); // Subscriber A: 2

// Subscriber B gets the most recent value (2) immediately upon subscription
subject.subscribe(value => console.log(`Subscriber B: ${value}`)); // Subscriber B: 2

subject.next(3); // Subscriber A: 3, Subscriber B: 3

// You can also get the current value synchronously
console.log(`Current value: ${subject.getValue()}`); // Current value: 3
```

```typescript
// ReplaySubject

import { ReplaySubject } from 'rxjs';

// Buffer the last 2 values
const subject = new ReplaySubject<number>(2);

subject.next(1);
subject.next(2);
subject.next(3);

// Subscriber A will get the last 2 buffered values (2 and 3)
subject.subscribe(value => console.log(`Subscriber A: ${value}`));
// Subscriber A: 2
// Subscriber A: 3

subject.next(4); // Subscriber A: 4
```


```typescript
// AsyncSubject

import { AsyncSubject } from 'rxjs';

const subject = new AsyncSubject<number>();

subject.subscribe(value => console.log(`Subscriber A: ${value}`));

subject.next(1);
subject.next(2);
subject.next(3);

// Nothing is logged yet...

subject.complete(); // Now, the last value (3) is emitted

// Subscriber A: 3
```
### Essential RxJS Operators

*   **`map(project)`**: Transforms each value emitted by the source observable. Similar to `Array.prototype.map`.
    *   *Use Case*: Extracting a property from an object returned by an HTTP call. `map(response => response.data)`.

*   **`filter(predicate)`**: Emits only the values from the source that pass a given test. Similar to `Array.prototype.filter`.
    *   *Use Case*: Ignoring invalid form values. `form.valueChanges.pipe(filter(() => form.valid))`.

*   **`tap(observer)`**: Perform a side effect for every emission, without modifying the stream itself.
    *   *Use Case*: Logging values for debugging. `tap(value => console.log('Current value:', value))`.

*   **`switchMap(project)`**: Maps each value to an inner observable, but cancels the previous inner observable when a new outer value arrives.
    *   *Use Case*: Handling "type-ahead" search inputs. When the user types a new query, the previous HTTP request for the old query is cancelled.

*   **`catchError(selector)`**: Catches errors on the source observable and replaces it with a new observable or throws an error.
    *   *Use Case*: Handling HTTP errors gracefully. `catchError(err => of([])) // Return an empty array on error`.

*   **`takeUntil(notifier)`**: Emits values from the source observable until a `notifier` observable emits.
    *   *Use Case*: A common pattern for declaratively unsubscribing from observables in a component. A subject emits in `ngOnDestroy`, and all component subscriptions use `takeUntil(this.destroy$)`. (Largely replaced by the `async` pipe or `takeUntilDestroyed` in modern Angular).
---

## 4.3 Reactive State Management Patterns

For managing state reactively in Angular, there are two primary patterns that cover a wide range of needs.

### The Service-with-a-Subject Pattern

* using a `BehaviorSubject` inside an injectable service
* simple and effective 
* ideal for small-to-medium-sized applications 
* managing state that is local to a specific feature area

The most common pattern is to create a service that encapsulates state and exposes it as an observable.

1.  **Private State**: The service holds state in a private `BehaviorSubject`. This prevents components from directly pushing new values into it.
2.  **Public Observable**: The service exposes a public observable derived from the subject using `.asObservable()`. This creates a read-only stream for components.
3.  **Public Methods**: The service exposes public methods to modify the state. These methods call `.next()` on the private subject, ensuring state changes are controlled and predictable.

**Example: `user.service.ts`**

```typescript
export interface User {
  id: number;
  name: string;
  isLoggedIn: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // 1. Private state holder
  private readonly userState = new BehaviorSubject<User>({
    id: 0,
    name: 'Guest',
    isLoggedIn: false,
  });

  // 2. Public observable stream for components to consume
  public readonly user$: Observable<User> = this.userState.asObservable();

  // Derived streams are also common and powerful
  public readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => user.isLoggedIn)
  );

  // 3. Public methods to update the state
  public login(name: string): void {
    const newUser: User = { id: 1, name, isLoggedIn: true };
    this.userState.next(newUser);
  }

  public logout(): void {
    const guestUser: User = { id: 0, name: 'Guest', isLoggedIn: false };
    this.userState.next(guestUser);
  }
}
```


---
### The NgRx Pattern (Advanced State Management) 

NgRx provides a robust framework for state management, inspired by Redux and built entirely on RxJS. 
* a strict  data flow
* single source of truth 
* unidirectional 
* more predictable and traceable

#### Core NgRx Concepts 

* **Store**: A global, observable stream of your application's entire state. 
* **Actions**: Plain objects that express unique events. They are the only way to trigger a state change. 
* **Reducers**: Pure functions that take the current state and an action, and return a new state. 
* **Selectors**: Pure functions that derive and compose slices of state from the store. +* Effects: Listen for action streams and perform side effects, like making an API call, then dispatch new actions. 

#### When to use NgRx? 

* when you have complex state interactions
* when many components need to share and manipulate the same state
* when you need advanced features like dev tools for time-travel debugging. 


**Example: A Simple Counter with NgRx**

1. Define Actions (counter.actions.ts)

    ```typescript
    import { createAction } from '@ngrx/store';
    export const increment = createAction('[Counter Component] Increment');
    export const decrement = createAction('[Counter Component] Decrement');
    export const reset = createAction('[Counter Component] Reset');
    ```

2. Define a Reducer (counter.reducer.ts)

    ```typescript
    import { createReducer, on } from '@ngrx/store';
    import { increment, decrement, reset } from './counter.actions';
    export const initialState = 0;
    export const counterReducer = createReducer(
        initialState,
        on(increment, (state) => state + 1),
        on(decrement, (state) => state - 1),
        on(reset, (state) => 0)
    );
    ```

3. Define a Selector (counter.selectors.ts) 

    ```typescript
    import { createFeatureSelector } from '@ngrx/store';
    // Assumes the counter state is registered under the 'count' feature key
    export const selectCount = createFeatureSelector('count');
    ```

4. Consume in a Component (counter.component.ts)

    ```typescript
    import { Component, inject } from '@angular/core';
    import { Store } from '@ngrx/store';
    import { Observable } from 'rxjs';
    import { increment, decrement, reset } from './counter.actions';
    import { selectCount } from './counter.selectors';
 
    @Component({
        selector: 'app-counter',
        template: `
        <h2>Count: {{ count$ | async }}</h2>
        <button (click)="increment()">+</button>
        <button (click)="decrement()">-</button>
        <button (click)="reset()">Reset</button>
        `,
        })
    export class CounterComponent {
        private readonly store = inject(Store);
        public readonly count$: Observable<number> = this.store.select(selectCount);
            increment() { this.store.dispatch(increment()); }
        decrement() { this.store.dispatch(decrement()); }
        reset() { this.store.dispatch(reset()); }
    }
    ```



---
