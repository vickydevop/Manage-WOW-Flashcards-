import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiPrefixInterceptor } from './core/config/api-prefix.interceptor';
import { StyleManager } from './shared/services/style-manager/style-manager.service';
import { SharedModule } from './shared/shared.module';
export function tokenGetter() {
  return sessionStorage.getItem('access_token');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    StyleManager,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
