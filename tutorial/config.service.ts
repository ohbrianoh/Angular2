import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private config: AppConfig | undefined;

  loadConfig() {
    return firstValueFrom(this.http.get<AppConfig>('/config.json'))
      .then(config => this.config = config);
  }

  get apiUrl(): string {
    // Default to the local json-server for development if config isn't loaded or is empty.
    return this.config?.apiUrl || 'http://localhost:3000';
  }
}