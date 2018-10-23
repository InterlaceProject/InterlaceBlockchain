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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
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

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SysAccountComponent,
    CCAccountComponent,
    PendingTransferComponent,
    DeltaDebtComponent,
    SubscriberComponent,
    IndividualComponent,
    CreditTransferComponent,
    DebitTransferComponent,
    DebitTransferAcknowledgeComponent,
    InitBlockchainComponent,
    CleanupPendingTransfersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
