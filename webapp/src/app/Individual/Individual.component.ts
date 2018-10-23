/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IndividualService } from './Individual.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-individual',
  templateUrl: './Individual.component.html',
  styleUrls: ['./Individual.component.css'],
  providers: [IndividualService]
})
export class IndividualComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  firstName = new FormControl('', Validators.required);
  surName = new FormControl('', Validators.required);
  employedBy = new FormControl('', Validators.required);
  memberID = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);
  activeGroup = new FormControl('', Validators.required);
  capacity = new FormControl('', Validators.required);


  constructor(public serviceIndividual: IndividualService, fb: FormBuilder) {
    this.myForm = fb.group({
      firstName: this.firstName,
      surName: this.surName,
      employedBy: this.employedBy,
      memberID: this.memberID,
      email: this.email,
      phone: this.phone,
      activeGroup: this.activeGroup,
      capacity: this.capacity
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceIndividual.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'net.sardex.interlace.Individual',
      'firstName': this.firstName.value,
      'surName': this.surName.value,
      'employedBy': this.employedBy.value,
      'memberID': this.memberID.value,
      'email': this.email.value,
      'phone': this.phone.value,
      'activeGroup': this.activeGroup.value,
      'capacity': this.capacity.value
    };

    this.myForm.setValue({
      'firstName': null,
      'surName': null,
      'employedBy': null,
      'memberID': null,
      'email': null,
      'phone': null,
      'activeGroup': null,
      'capacity': null
    });

    return this.serviceIndividual.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'firstName': null,
        'surName': null,
        'employedBy': null,
        'memberID': null,
        'email': null,
        'phone': null,
        'activeGroup': null,
        'capacity': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'net.sardex.interlace.Individual',
      'firstName': this.firstName.value,
      'surName': this.surName.value,
      'employedBy': this.employedBy.value,
      'email': this.email.value,
      'phone': this.phone.value,
      'activeGroup': this.activeGroup.value,
      'capacity': this.capacity.value
    };

    return this.serviceIndividual.updateParticipant(form.get('memberID').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceIndividual.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceIndividual.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'firstName': null,
        'surName': null,
        'employedBy': null,
        'memberID': null,
        'email': null,
        'phone': null,
        'activeGroup': null,
        'capacity': null
      };

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.surName) {
        formObject.surName = result.surName;
      } else {
        formObject.surName = null;
      }

      if (result.employedBy) {
        formObject.employedBy = result.employedBy;
      } else {
        formObject.employedBy = null;
      }

      if (result.memberID) {
        formObject.memberID = result.memberID;
      } else {
        formObject.memberID = null;
      }

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
      }

      if (result.phone) {
        formObject.phone = result.phone;
      } else {
        formObject.phone = null;
      }

      if (result.activeGroup) {
        formObject.activeGroup = result.activeGroup;
      } else {
        formObject.activeGroup = null;
      }

      if (result.capacity) {
        formObject.capacity = result.capacity;
      } else {
        formObject.capacity = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'firstName': null,
      'surName': null,
      'employedBy': null,
      'memberID': null,
      'email': null,
      'phone': null,
      'activeGroup': null,
      'capacity': null
    });
  }
}
