import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-quest-point',
  templateUrl: './quest-point.component.html',
  styleUrls: ['./quest-point.component.css']
})
export class QuestPointComponent {

  @Input() latitude = 0;
  @Input() longitude = 0;

  constructor(public sanitizer: DomSanitizer) { }

  getUrl = () => `https://www.google.com/maps/embed/v1/search?q=${this.latitude},${this.longitude}&key=${environment.google_maps_key}`;
}
