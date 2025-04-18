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

/**
 * Configuración de rutas de la aplicación
 * Define todas las URL accesibles y los componentes que se cargan en cada una
 */
export const routes: Routes = [
    // Ruta principal - Página de inicio
    { path: '', component: InicioComponent },
    
    // Rutas para componentes estructurales
    { path: 'header', component: HeaderComponent},
    { path: 'footer', component: FooterComponent},
    
    // Rutas para autenticación y gestión de cuentas
    { path: 'login', component: LoginComponent},
    { path: 'registrarse', component: RegistrarseComponent},
    { path: 'activar-cuenta', component: ActivarCuentaComponent},
    { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent},
    
    // Rutas para servicios e información
    { path: 'servicios', component: ServiciosComponent},
    { path: 'faq', component: FaqComponent},
    { path: 'citas', component: CitasComponent},
    
    // Rutas para el sistema de quejas y sugerencias (PQRS)
    { path: 'nueva-queja', component: NuevaQuejaComponent},
    { path: 'mis-quejas', component: MisQuejasComponent},
    { path: 'sugerencias', component: SugerenciasComponent},
    
    // Rutas para funcionalidades administrativas
    { path: 'gestionar-quejas', component: GestionarQuejasComponent},
    { path: 'gestionar_sugerencias', component: GestionarSugerenciasComponent},
    
    // Ruta comodín: redirige a la página principal cuando se ingresa una ruta inexistente
    { path: "**", pathMatch: "full", redirectTo: "" }
];