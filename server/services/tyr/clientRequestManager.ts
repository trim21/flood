import {RPCError} from './types/RPCError';

import axios from 'axios';

import type {TYRConnectionSettings} from '@shared/schema/ClientConnectionSettings';

class ClientRequestManager {
  settings: TYRConnectionSettings;

  constructor(settings: TYRConnectionSettings) {
    this.settings = settings;
  }

  async methodCall(methodName: string, params: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = {
      jsonrpc: '2.0',
      id: null,
      method: methodName,
      params,
    };

    const json = JSON.stringify(request);

    const res = await axios.post(this.settings.url, json, {
      headers: {Authorization: this.settings.token},
    });

    const jsonResponse = res.data;
    if (typeof jsonResponse.error !== 'undefined') {
      const {code, data, message} = jsonResponse.error;
      throw new RPCError(code, message, data);
    }

    return jsonResponse.result;
  }
}

export default ClientRequestManager;
