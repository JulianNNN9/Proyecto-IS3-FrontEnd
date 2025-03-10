import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { CitasComponent } from './components/citas/citas.component';
import { GestionarQuejasComponent } from './components/gestionar-quejas/gestionar-quejas.component';
import { FaqComponent } from './components/faq/faq.component';
import { NuevaQuejaComponent } from './components/nueva-queja/nueva-queja.component';
import { MisQuejasComponent } from './components/mis-quejas/mis-quejas.component';
import { ActivarCuentaComponent } from './components/activar-cuenta/activar-cuenta.component';
import { OlvidarContraseniaComponent } from './components/olvidar-contrasenia/olvidar-contrasenia.component';
import { SugerenciasComponent } from './components/sugerencias/sugerencias.component';
import { GestionarSugerenciasComponent } from './components/gestionar-sugerencias/gestionar-sugerencias.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CambiarContraseniaComponent } from './components/cambiar-contrasenia/cambiar-contrasenia.component';


export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'header', component: HeaderComponent},
    { path: 'footer', component: FooterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registrarse', component: RegistrarseComponent},
    { path: 'activar-cuenta', component: ActivarCuentaComponent},
    { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent},
    { path: 'servicios', component: ServiciosComponent},
    { path: 'gestionar-quejas', component: GestionarQuejasComponent},
    { path: 'faq', component: FaqComponent},
    { path: 'citas', component: CitasComponent},
    { path: 'nueva-queja', component: NuevaQuejaComponent},
    { path: 'mis-quejas', component: MisQuejasComponent},
    { path: 'sugerencias', component: SugerenciasComponent},
    { path: 'gestionar_sugerencias', component: GestionarSugerenciasComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent},
    { path: "**", pathMatch: "full", redirectTo: "" }
];
