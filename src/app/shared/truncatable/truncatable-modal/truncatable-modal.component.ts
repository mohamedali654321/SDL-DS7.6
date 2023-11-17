import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'ds-truncatable-modal',
  templateUrl: './truncatable-modal.component.html',
  styleUrls: ['./truncatable-modal.component.scss']
})
export class TruncatableModalComponent {
constructor(public modal: NgbActiveModal,){}
content:string;

close() {
  this.modal.close();
}

}
