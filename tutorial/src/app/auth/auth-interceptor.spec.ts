import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthInterceptor } from './auth-interceptor';

describe('AuthInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const testUrl = '/api/data';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // This provides both the HttpClient and registers our functional interceptor.
        provideHttpClient(withInterceptors([AuthInterceptor])),
        // This provides the testing backend that allows us to mock and flush requests.
        provideHttpClientTesting(),
      ],
    });

    // Inject the tools we'll need.
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    // After each test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should add an Authorization header when a token is present in localStorage', () => {
    const testToken = 'my-secret-jwt-token';
    // Spy on localStorage.getItem to simulate a token being present.
    spyOn(localStorage, 'getItem').and.returnValue(testToken);

    // 1. INITIATE THE REQUEST:
    // This is what "makes the call". The .subscribe() triggers the HttpClient to send the request.
    httpClient.get(testUrl).subscribe();

    // 2. INTERCEPT THE REQUEST:
    // HttpTestingController intercepts the outgoing request. `expectOne()` asserts that a request
    // to this URL was made and returns a handle to it. The test will fail if no request was made.
    const req = httpTestingController.expectOne(testUrl);

    // 3. ASSERT ON THE REQUEST:
    // Now we can inspect the request object to ensure our interceptor added the correct header.
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);

    // 4. COMPLETE THE REQUEST:
    // `flush()` simulates the server sending a response, which completes the Observable stream
    // from the .subscribe() call. The `{}` is the mock response body.
    req.flush({});
  });

  it('should not add an Authorization header when no token is present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    httpClient.get(testUrl).subscribe();
    const req = httpTestingController.expectOne(testUrl);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
