import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'header', component: HeaderComponent},
    { path: 'footer', component: FooterComponent},
    { path: "**", pathMatch: "full", redirectTo: "" }
];
