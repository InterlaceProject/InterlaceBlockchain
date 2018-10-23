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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { SysAccountComponent } from './SysAccount/SysAccount.component';
import { CCAccountComponent } from './CCAccount/CCAccount.component';
import { PendingTransferComponent } from './PendingTransfer/PendingTransfer.component';
import { DeltaDebtComponent } from './DeltaDebt/DeltaDebt.component';

import { SubscriberComponent } from './Subscriber/Subscriber.component';
import { IndividualComponent } from './Individual/Individual.component';

import { CreditTransferComponent } from './CreditTransfer/CreditTransfer.component';
import { DebitTransferComponent } from './DebitTransfer/DebitTransfer.component';
import { DebitTransferAcknowledgeComponent } from './DebitTransferAcknowledge/DebitTransferAcknowledge.component';
import { InitBlockchainComponent } from './InitBlockchain/InitBlockchain.component';
import { CleanupPendingTransfersComponent } from './CleanupPendingTransfers/CleanupPendingTransfers.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'SysAccount', component: SysAccountComponent },
  { path: 'CCAccount', component: CCAccountComponent },
  { path: 'PendingTransfer', component: PendingTransferComponent },
  { path: 'DeltaDebt', component: DeltaDebtComponent },
  { path: 'Subscriber', component: SubscriberComponent },
  { path: 'Individual', component: IndividualComponent },
  { path: 'CreditTransfer', component: CreditTransferComponent },
  { path: 'DebitTransfer', component: DebitTransferComponent },
  { path: 'DebitTransferAcknowledge', component: DebitTransferAcknowledgeComponent },
  { path: 'InitBlockchain', component: InitBlockchainComponent },
  { path: 'CleanupPendingTransfers', component: CleanupPendingTransfersComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
