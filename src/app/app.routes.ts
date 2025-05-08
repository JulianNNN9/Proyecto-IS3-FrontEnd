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
import { CitasEstilistaComponent } from './components/citas-estilista/citas-estilista.component';
import { SugerenciasComponent } from './components/sugerencias/sugerencias.component';
import { GestionarSugerenciasComponent } from './components/gestionar-sugerencias/gestionar-sugerencias.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CambiarContraseniaComponent } from './components/cambiar-contrasenia/cambiar-contrasenia.component';
import { MisCitasComponent } from './components/mis-citas/mis-citas.component';
import { AgendarCitaComponent } from './components/agendar-cita/agendar-cita.component';
import { HistorialCitasComponent } from './components/historial-citas/historial-citas.component';
import { AuthClienteGuard } from './guardians/auth-cliente.guard';
import { AuthAdminClienteGuard } from './guardians/auth-admin-cliente.guard';
import { LoginGuard } from './guardians/login.guard';
import { AuthAdminGuard } from './guardians/auth-admin.guard';
import { CrearCuponComponent } from './components/crear-cupon/crear-cupon.component';
import { CuponesComponent } from './components/cupones/cupones.component';
import { EditarCuponComponent } from './components/editar-cupon/editar-cupon.component';

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
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
    { path: 'registrarse', component: RegistrarseComponent, canActivate: [LoginGuard]},
    { path: 'activar-cuenta', component: ActivarCuentaComponent, canActivate: [LoginGuard]},
    { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent, canActivate: [LoginGuard]},
    { path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthAdminClienteGuard]},
    { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent, canActivate: [AuthAdminClienteGuard]},
    
    // Rutas para servicios e información
    { path: 'servicios', component: ServiciosComponent},
    { path: 'faq', component: FaqComponent, canActivate: [AuthClienteGuard]},
    { path: 'citas', component: CitasComponent},
    { path: 'mis-citas', component: MisCitasComponent},
    { path: 'agendar-cita', component: AgendarCitaComponent},
    { path: 'historial-citas', component: HistorialCitasComponent}, // Redirige a la misma página de citas
    
    // Rutas para el sistema de quejas y sugerencias (PQRS)
    { path: 'nueva-queja', component: NuevaQuejaComponent, canActivate: [AuthClienteGuard]},
    { path: 'mis-quejas', component: MisQuejasComponent, canActivate: [AuthClienteGuard]},
    { path: 'sugerencias', component: SugerenciasComponent, canActivate: [AuthClienteGuard]},
    
    // Rutas para funcionalidades administrativas
    { path: 'gestionar-quejas', component: GestionarQuejasComponent, canActivate: [AuthAdminGuard] },
    { path: 'gestionar_sugerencias', component: GestionarSugerenciasComponent, canActivate: [AuthAdminGuard] },
    

    // Rutas para estilistas
    { path: 'citas-estilista', component: CitasEstilistaComponent },

    // Rutas para administradores
    { path: 'crear-cupon', component: CrearCuponComponent, canActivate: [AuthAdminGuard] },
    { path: 'cupones', component: CuponesComponent, canActivate: [AuthAdminGuard] },
    { path: 'editar-cupon/:id', component: EditarCuponComponent, canActivate: [AuthAdminGuard] },

    // Ruta comodín: redirige a la página principal cuando se ingresa una ruta inexistente
    { path: "**", pathMatch: "full", redirectTo: "" }
];