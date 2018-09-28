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
import { SubscriberService } from './Subscriber.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-subscriber',
  templateUrl: './Subscriber.component.html',
  styleUrls: ['./Subscriber.component.css'],
  providers: [SubscriberService]
})
export class SubscriberComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  entityName = new FormControl('', Validators.required);
  entityAddress = new FormControl('', Validators.required);
  memberID = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  phone = new FormControl('', Validators.required);


  constructor(public serviceSubscriber: SubscriberService, fb: FormBuilder) {
    this.myForm = fb.group({
      entityName: this.entityName,
      entityAddress: this.entityAddress,
      memberID: this.memberID,
      email: this.email,
      phone: this.phone
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceSubscriber.getAll()
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
      $class: 'net.sardex.interlace.Subscriber',
      'entityName': this.entityName.value,
      'entityAddress': this.entityAddress.value,
      'memberID': this.memberID.value,
      'email': this.email.value,
      'phone': this.phone.value
    };

    this.myForm.setValue({
      'entityName': null,
      'entityAddress': null,
      'memberID': null,
      'email': null,
      'phone': null
    });

    return this.serviceSubscriber.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'entityName': null,
        'entityAddress': null,
        'memberID': null,
        'email': null,
        'phone': null
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
      $class: 'net.sardex.interlace.Subscriber',
      'entityName': this.entityName.value,
      'entityAddress': this.entityAddress.value,
      'email': this.email.value,
      'phone': this.phone.value
    };

    return this.serviceSubscriber.updateParticipant(form.get('memberID').value, this.participant)
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

    return this.serviceSubscriber.deleteParticipant(this.currentId)
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

    return this.serviceSubscriber.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'entityName': null,
        'entityAddress': null,
        'memberID': null,
        'email': null,
        'phone': null
      };

      if (result.entityName) {
        formObject.entityName = result.entityName;
      } else {
        formObject.entityName = null;
      }

      if (result.entityAddress) {
        formObject.entityAddress = result.entityAddress;
      } else {
        formObject.entityAddress = null;
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
      'entityName': null,
      'entityAddress': null,
      'memberID': null,
      'email': null,
      'phone': null
    });
  }
}
