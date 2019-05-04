import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-quest-point',
  templateUrl: './quest-point.component.html',
  styleUrls: ['./quest-point.component.css']
})
export class QuestPointComponent implements OnInit {

  // @Input() coordinates: {latitude: number, longitude: number};
  @Input() latitude: number;
  @Input() longitude: number;

  coordinates = {
    latitude: 48.8515833,
    longitude: 2.3485891
  };

  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  getUrl(coord): string {
    return `https://www.google.com/maps/embed/v1/search?q=${this.latitude},${this.longitude}&key=${environment.google_maps_key}`;
  }

}
