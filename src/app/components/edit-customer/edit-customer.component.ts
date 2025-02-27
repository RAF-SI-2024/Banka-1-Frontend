import {Component, OnInit} from '@angular/core';
import {Customer, UserService} from "../../services/user.service";
import {ModalService} from "../../services/modal.service";


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent{
  isOpen = false;
  customer: Customer | null = null;
  isAccountModalOpen: boolean = false
  selectedAccount: string = '';
  newAccount: string = '';
  updatedClient: any = {};
  updatedCostumerFields: Partial<typeof this.customer> = {};

  constructor(private modalService: ModalService, private userService: UserService) {
    this.modalService.modalState$.subscribe((state) => {
      this.isOpen = state.isOpen && state.type === 'customer';
      this.customer = state.data as Customer;
      this.updatedClient = structuredClone(this.customer);
      this.updatedCostumerFields = {};
    });
  }


  trackCustomerChanges() {
    this.updatedCostumerFields = {};

    if (!this.customer || !this.updatedClient) {
      console.warn('Customer or updatedClient is null'); // Debugging
      return; // Stop execution if either is null
    }

    Object.keys(this.customer).forEach((key) => {
      const originalValue = (this.customer as Record<string, any>)[key];
      const updatedValue = (this.updatedClient as Record<string, any>)[key];

      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
          (this.updatedCostumerFields as Record<string, any>)[key] = [...updatedValue];
        }
      } else if (originalValue !== updatedValue) {
        (this.updatedCostumerFields as Record<string, any>)[key] = updatedValue;
      }
    });
  }

  updateCustomer(){

    if(this.customer == null || this.updatedCostumerFields == null) return;

    if(Object.keys(this.updatedCostumerFields).length != 0) {

    this.userService.updateCustomer(this.customer.id, this.updatedCostumerFields).subscribe({
      next: () => {
        alert('Client updated sucessfully');
      },
      error: (error) => {
        console.error('Error updating client', error);
    },
    });
    }
  }

  addAccount(){
    if(this.newAccount && !this.updatedClient.povezaniRacuni.includes(this.newAccount)){
      this.updatedClient.povezaniRacuni.push(this.newAccount);
      this.newAccount = ''
      this.closeAccountModal()
      this.trackCustomerChanges();
    }else{
      alert("Taj nalog vec postji.")
    }
  }

  removeAccount() {
    if (confirm("Da li ste sigurni da zelite da obrisete racun " + this.selectedAccount +"?")) {
      this.updatedClient.povezaniRacuni = this.updatedClient.povezaniRacuni.filter((account: string) => account !== this.selectedAccount);
      this.trackCustomerChanges();
    } else {
      console.log("Action canceled.");
    }
  }
  openAccountModal() {
    this.isAccountModalOpen = true;
  }

  closeAccountModal() {
    this.isAccountModalOpen = false;
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
