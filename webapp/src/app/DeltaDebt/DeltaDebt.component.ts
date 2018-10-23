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
import { DeltaDebtService } from './DeltaDebt.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-deltadebt',
  templateUrl: './DeltaDebt.component.html',
  styleUrls: ['./DeltaDebt.component.css'],
  providers: [DeltaDebtService]
})
export class DeltaDebtComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  id = new FormControl('', Validators.required);
  created = new FormControl('', Validators.required);
  due = new FormControl('', Validators.required);
  amount = new FormControl('', Validators.required);
  deptPos = new FormControl('', Validators.required);
  debitorID = new FormControl('', Validators.required);

  constructor(public serviceDeltaDebt: DeltaDebtService, fb: FormBuilder) {
    this.myForm = fb.group({
      id: this.id,
      created: this.created,
      due: this.due,
      amount: this.amount,
      deptPos: this.deptPos,
      debitorID: this.debitorID
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDeltaDebt.getAll()
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
      $class: 'net.sardex.interlace.DeltaDebt',
      'id': this.id.value,
      'created': this.created.value,
      'due': this.due.value,
      'amount': this.amount.value,
      'deptPos': this.deptPos.value,
      'debitorID': this.debitorID.value
    };

    this.myForm.setValue({
      'id': null,
      'created': null,
      'due': null,
      'amount': null,
      'deptPos': null,
      'debitorID': null
    });

    return this.serviceDeltaDebt.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'id': null,
        'created': null,
        'due': null,
        'amount': null,
        'deptPos': null,
        'debitorID': null
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
      $class: 'net.sardex.interlace.DeltaDebt',
      'created': this.created.value,
      'due': this.due.value,
      'amount': this.amount.value,
      'deptPos': this.deptPos.value,
      'debitorID': this.debitorID.value
    };

    return this.serviceDeltaDebt.updateAsset(form.get('id').value, this.asset)
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

    return this.serviceDeltaDebt.deleteAsset(this.currentId)
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

    return this.serviceDeltaDebt.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'id': null,
        'created': null,
        'due': null,
        'amount': null,
        'deptPos': null,
        'debitorID': null
      };

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.created) {
        formObject.created = result.created;
      } else {
        formObject.created = null;
      }

      if (result.due) {
        formObject.due = result.due;
      } else {
        formObject.due = null;
      }

      if (result.amount) {
        formObject.amount = result.amount;
      } else {
        formObject.amount = null;
      }

      if (result.deptPos) {
        formObject.deptPos = result.deptPos;
      } else {
        formObject.deptPos = null;
      }

      if (result.debitorID) {
        formObject.debitorID = result.debitorID;
      } else {
        formObject.debitorID = null;
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
      'id': null,
      'created': null,
      'due': null,
      'amount': null,
      'deptPos': null,
      'debitorID': null
      });
  }

}
