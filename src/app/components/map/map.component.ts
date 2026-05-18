import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() latitude = 0;
  @Input() longitude = 0;
  safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.updateSafeUrl();
  }

  ngOnChanges(): void {
    this.updateSafeUrl();
  }

  private updateSafeUrl(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed/v1/search?q=${this.latitude},${this.longitude}&key=${environment.google_maps_key}`
    );
  }

}
