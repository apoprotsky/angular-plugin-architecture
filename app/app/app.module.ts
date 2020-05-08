import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PluginsService } from './plugins.service';
import { PluginsProvider } from './plugins.provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    PluginsService,
    PluginsProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: (provider: PluginsProvider) => () =>
        provider
          .loadConfig()
          .toPromise()
          .then(config => (provider.config = config)),
      multi: true,
      deps: [PluginsProvider]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
