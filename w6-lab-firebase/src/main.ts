import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"fir-ionic-project-883d7","appId":"1:48854513740:web:1f64aa81b45ab1bb7c5ce9","storageBucket":"fir-ionic-project-883d7.appspot.com","apiKey":"AIzaSyAvOduobh0RiKaSM2UFvtYS-Ra5YUmf2F8","authDomain":"fir-ionic-project-883d7.firebaseapp.com","messagingSenderId":"48854513740"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
