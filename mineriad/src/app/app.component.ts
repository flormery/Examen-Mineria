import { Component } from '@angular/core';
import { NewsPortalComponent } from './noticiasp/noticiass.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NewsPortalComponent],
  template: `
    <app-noticiass></app-noticiass>
  `
})
export class AppComponent {
  title = 'portal-noticias';
}
