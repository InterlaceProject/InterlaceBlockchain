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
import { SysAccountService } from './SysAccount.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-sysaccount',
  templateUrl: './SysAccount.component.html',
  styleUrls: ['./SysAccount.component.css'],
  providers: [SysAccountService]
})
export class SysAccountComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  accountID = new FormControl('', Validators.required);
  unit = new FormControl('', Validators.required);
  balance = new FormControl('', Validators.required);
  availableCapacity = new FormControl('', Validators.required);
  member = new FormControl('', Validators.required);

  constructor(public serviceSysAccount: SysAccountService, fb: FormBuilder) {
    this.myForm = fb.group({
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
    return this.serviceSysAccount.getAll()
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
      $class: 'net.sardex.interlace.SysAccount',
      'accountID': this.accountID.value,
      'unit': this.unit.value,
      'balance': this.balance.value,
      'availableCapacity': this.availableCapacity.value,
      'member': this.member.value
    };

    this.myForm.setValue({
      'accountID': null,
      'unit': null,
      'balance': null,
      'availableCapacity': null,
      'member': null
    });

    return this.serviceSysAccount.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
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
      $class: 'net.sardex.interlace.SysAccount',
      'unit': this.unit.value,
      'balance': this.balance.value,
      'availableCapacity': this.availableCapacity.value,
      'member': this.member.value
    };

    return this.serviceSysAccount.updateAsset(form.get('accountID').value, this.asset)
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

    return this.serviceSysAccount.deleteAsset(this.currentId)
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

    return this.serviceSysAccount.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'accountID': null,
        'unit': null,
        'balance': null,
        'availableCapacity': null,
        'member': null
      };

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
      'accountID': null,
      'unit': null,
      'balance': null,
      'availableCapacity': null,
      'member': null
      });
  }

}
