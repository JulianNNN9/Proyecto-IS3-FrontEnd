import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { CitasComponent } from './components/citas/citas.component';
import { EnviarQuejaComponent } from './components/enviar-queja/enviar-queja.component';
import { GestionarQuejasComponent } from './components/gestionar-quejas/gestionar-quejas.component';
import { ReporteGraficosComponent } from './components/reporte-graficos/reporte-graficos.component';
import { FaqComponent } from './components/faq/faq.component';
import { NuevaQuejaComponent } from './components/nueva-queja/nueva-queja.component';
import { MisQuejasComponent } from './components/mis-quejas/mis-quejas.component';
<<<<<<< HEAD
import { ActivarCuentaComponent } from './components/activar-cuenta/activar-cuenta.component';
import { OlvidarContraseniaComponent } from './components/olvidar-contrasenia/olvidar-contrasenia.component';
=======
import { SugerenciasComponent } from './components/sugerencias/sugerencias.component';
import { HistorialSugerenciasComponent } from './components/historial-sugerencias/historial-sugerencias.component';
>>>>>>> origin


export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'header', component: HeaderComponent},
    { path: 'footer', component: FooterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registrarse', component: RegistrarseComponent},
    { path: 'activar-cuenta', component: ActivarCuentaComponent},
    { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent},
    { path: 'servicios', component: ServiciosComponent},
    { path: 'enviar-queja', component: EnviarQuejaComponent},
    { path: 'gestionar-queja', component: GestionarQuejasComponent},
    { path: 'reporte-graficos', component: ReporteGraficosComponent},
    { path: 'faq', component: FaqComponent},
    { path: 'citas', component: CitasComponent},
    { path: 'nueva-queja', component: NuevaQuejaComponent},
    { path: 'mis-quejas', component: MisQuejasComponent},
    { path: 'sugerencias', component: SugerenciasComponent},
    { path: 'historial_sugerencias', component: HistorialSugerenciasComponent},
    { path: "**", pathMatch: "full", redirectTo: "" }
];
