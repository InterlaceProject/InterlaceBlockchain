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
import { CCAccountService } from './CCAccount.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-ccaccount',
  templateUrl: './CCAccount.component.html',
  styleUrls: ['./CCAccount.component.css'],
  providers: [CCAccountService]
})
export class CCAccountComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  creditLimit = new FormControl('', Validators.required);
  creditLimitDate = new FormControl('', Validators.required);
  upperLimit = new FormControl('', Validators.required);
  accountID = new FormControl('', Validators.required);
  unit = new FormControl('', Validators.required);
  balance = new FormControl('', Validators.required);
  availableCapacity = new FormControl('', Validators.required);
  member = new FormControl('', Validators.required);

  constructor(public serviceCCAccount: CCAccountService, fb: FormBuilder) {
    this.myForm = fb.group({
      creditLimit: this.creditLimit,
      creditLimitDate: this.creditLimitDate,
      upperLimit: this.upperLimit,
      accountID: this.accountID,
      unit: this.unit,
      balance: this.balance,
      availableCapacity: this.availableCapacity,
      member: this.member
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCCAccount.getAll()
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
      $class: 'net.sardex.interlace.CCAccount',
      'creditLimit': this.creditLimit.value,
      'creditLimitDate': this.creditLimitDate.value,
      'upperLimit': this.upperLimit.value,
      'accountID': this.accountID.value,
      'unit': this.unit.value,
      'balance': this.balance.value,
      'availableCapacity': this.availableCapacity.value,
      'member': this.member.value
    };

    this.myForm.setValue({
      'creditLimit': null,
      'creditLimitDate': null,
      'upperLimit': null,
      'accountID': null,
      'unit': null,
      'balance': null,
      'availableCapacity': null,
      'member': null
    });

    return this.serviceCCAccount.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'creditLimit': null,
        'creditLimitDate': null,
        'upperLimit': null,
        'accountID': null,
        'unit': null,
        'balance': null,
        'availableCapacity': null,
        'member': null
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
      $class: 'net.sardex.interlace.CCAccount',
      'creditLimit': this.creditLimit.value,
      'creditLimitDate': this.creditLimitDate.value,
      'upperLimit': this.upperLimit.value,
      'unit': this.unit.value,
      'balance': this.balance.value,
      'availableCapacity': this.availableCapacity.value,
      'member': this.member.value
    };

    return this.serviceCCAccount.updateAsset(form.get('accountID').value, this.asset)
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

    return this.serviceCCAccount.deleteAsset(this.currentId)
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

    return this.serviceCCAccount.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'creditLimit': null,
        'creditLimitDate': null,
        'upperLimit': null,
        'accountID': null,
        'unit': null,
        'balance': null,
        'availableCapacity': null,
        'member': null
      };

      if (result.creditLimit) {
        formObject.creditLimit = result.creditLimit;
      } else {
        formObject.creditLimit = null;
      }

      if (result.creditLimitDate) {
        formObject.creditLimitDate = result.creditLimitDate;
      } else {
        formObject.creditLimitDate = null;
      }

      if (result.upperLimit) {
        formObject.upperLimit = result.upperLimit;
      } else {
        formObject.upperLimit = null;
      }

      if (result.accountID) {
        formObject.accountID = result.accountID;
      } else {
        formObject.accountID = null;
      }

      if (result.unit) {
        formObject.unit = result.unit;
      } else {
        formObject.unit = null;
      }

      if (result.balance) {
        formObject.balance = result.balance;
      } else {
        formObject.balance = null;
      }

      if (result.availableCapacity) {
        formObject.availableCapacity = result.availableCapacity;
      } else {
        formObject.availableCapacity = null;
      }

      if (result.member) {
        formObject.member = result.member;
      } else {
        formObject.member = null;
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
      'creditLimit': null,
      'creditLimitDate': null,
      'upperLimit': null,
      'accountID': null,
      'unit': null,
      'balance': null,
      'availableCapacity': null,
      'member': null
      });
  }

}
