import jsonpatch, {Operation} from 'fast-json-patch';
import {makeAutoObservable} from 'mobx';

import type {TransferDirection, TransferHistory, TransferSummary} from '@shared/types/TransferData';

export const TRANSFER_DIRECTIONS: Readonly<Array<TransferDirection>> = ['download', 'upload'] as const;

class TransferDataStoreClass {
  transferRates: TransferHistory = {download: [], upload: [], timestamps: []};
  transferSummary: TransferSummary = {
    downRate: 0,
    downThrottle: 0,
    downTotal: 0,
    upRate: 0,
    upThrottle: 0,
    upTotal: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  appendCurrentTransferRateToHistory() {
    const download = this.transferRates.download.slice();
    const upload = this.transferRates.upload.slice();
    const timestamps = this.transferRates.timestamps.slice();

    download.shift();
    download.push(this.transferSummary.downRate);
    upload.shift();
    upload.push(this.transferSummary.upRate);
    timestamps.shift();
    timestamps.push(Date.now());

    this.transferRates = {download, upload, timestamps};
  }

  handleFetchTransferHistorySuccess(transferData: TransferHistory) {
    this.transferRates = transferData;
  }

  handleTransferSummaryDiffChange(diff: Operation[]) {
    jsonpatch.applyPatch(this.transferSummary, diff);
    this.appendCurrentTransferRateToHistory();
  }

  handleTransferSummaryFullUpdate(transferSummary: TransferSummary) {
    this.transferSummary = transferSummary;
    this.appendCurrentTransferRateToHistory();
  }
}

const TransferDataStore = new TransferDataStoreClass();

export default TransferDataStore;
