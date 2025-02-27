import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Customer, Employee} from "./user.service";


@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new BehaviorSubject<{
    isOpen: boolean;
    type: 'employee' | 'customer' | null;
    data: Employee | Customer | null; // Add a data field to hold the employee or customer
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  modalState$ = this.modalState.asObservable(); // Expose as observable

  openModal(type: 'employee' | 'customer', data: Employee | Customer) {
    this.modalState.next({ isOpen: true, type, data }); // Pass data when opening modal
  }

  closeModal() {
    this.modalState.next({ isOpen: false, type: null, data: null });
  }
}
