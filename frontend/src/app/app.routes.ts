import { Routes } from '@angular/router';
import { LigaMasterDetailComponent } from './pages/liga-master-detail/liga-master-detail.component';
import { SifrarnikIgracaComponent } from './pages/sifrarnik-igraca/sifrarnik-igraca.component';

export const routes: Routes = [
    { path: '', redirectTo: 'lige', pathMatch: 'full' },
    { path: 'lige', component: LigaMasterDetailComponent },
    { path: 'igraci', component: SifrarnikIgracaComponent },
    { path: '**', redirectTo: 'lige' }
];
