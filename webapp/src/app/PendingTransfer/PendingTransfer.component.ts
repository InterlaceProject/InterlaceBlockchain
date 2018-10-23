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
import { PendingTransferService } from './PendingTransfer.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-pendingtransfer',
  templateUrl: './PendingTransfer.component.html',
  styleUrls: ['./PendingTransfer.component.css'],
  providers: [PendingTransferService]
})
export class PendingTransferComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  otp = new FormControl('', Validators.required);
  created = new FormControl('', Validators.required);
  expires = new FormControl('', Validators.required);
  rejectionReason = new FormControl('', Validators.required);
  transfer = new FormControl('', Validators.required);
  state = new FormControl('', Validators.required);

  constructor(public servicePendingTransfer: PendingTransferService, fb: FormBuilder) {
    this.myForm = fb.group({
      otp: this.otp,
      created: this.created,
      expires: this.expires,
      rejectionReason: this.rejectionReason,
      transfer: this.transfer,
      state: this.state
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePendingTransfer.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'net.sardex.interlace.PendingTransfer',
      'otp': this.otp.value,
      'created': this.created.value,
      'expires': this.expires.value,
      'rejectionReason': this.rejectionReason.value,
      'transfer': this.transfer.value,
      'state': this.state.value
    };

    this.myForm.setValue({
      'otp': null,
      'created': null,
      'expires': null,
      'rejectionReason': null,
      'transfer': null,
      'state': null
    });

    return this.servicePendingTransfer.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'otp': null,
        'created': null,
        'expires': null,
        'rejectionReason': null,
        'transfer': null,
        'state': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'net.sardex.interlace.PendingTransfer',
      'created': this.created.value,
      'expires': this.expires.value,
      'rejectionReason': this.rejectionReason.value,
      'transfer': this.transfer.value,
      'state': this.state.value
    };

    return this.servicePendingTransfer.updateAsset(form.get('otp').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.servicePendingTransfer.deleteAsset(this.currentId)
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

    return this.servicePendingTransfer.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'otp': null,
        'created': null,
        'expires': null,
        'rejectionReason': null,
        'transfer': null,
        'state': null
      };

      if (result.otp) {
        formObject.otp = result.otp;
      } else {
        formObject.otp = null;
      }

      if (result.created) {
        formObject.created = result.created;
      } else {
        formObject.created = null;
      }

      if (result.expires) {
        formObject.expires = result.expires;
      } else {
        formObject.expires = null;
      }

      if (result.rejectionReason) {
        formObject.rejectionReason = result.rejectionReason;
      } else {
        formObject.rejectionReason = null;
      }

      if (result.transfer) {
        formObject.transfer = result.transfer;
      } else {
        formObject.transfer = null;
      }

      if (result.state) {
        formObject.state = result.state;
      } else {
        formObject.state = null;
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
      'otp': null,
      'created': null,
      'expires': null,
      'rejectionReason': null,
      'transfer': null,
      'state': null
      });
  }

}
