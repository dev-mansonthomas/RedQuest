import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-waiting-modal',
  templateUrl: './waiting-modal.component.html',
  styleUrls: ['./waiting-modal.component.css']
})
export class WaitingModalComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  close() {
    this.closeModal.nativeElement.click();
  }

}
