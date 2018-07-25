import * as _  from 'lodash';

import { selectGroupism } from './lib/bootstrapism.js';
import { transactionService } from './services/transaction_service';
import { showSuccess } from './messages';

import { Virus } from './types/index';
import { updateEpidemic } from './lib/update_epidemic';
import networks from './lib/networks';

interface Signing {
  id: string;
  $virus: Virus;
  _transactionJson: string;
  class: string;
  _rawtx: string;
  $update: () => void;
  $$: Array<object>;
}

export function signingHandler (): Signing {
  return {
    id: 'signing',
    $virus: updateEpidemic,
    _transactionJson: '',
    class: 'form',
    _rawtx: '',
    $update() {
      let self = this;
      if (self._rawtx) {
        self.$build({
          class: 'alert alert-secondary serialized-hex-tx',
          $type: 'textarea',
          cols: 100,
          $text: this._rawtx
        });
        self.$build({
          $type: 'button',
          class: 'button btn btn-primary btn-block mt-1',
          id: 'broadcast-transaction',
          $text: 'Broadcast Transaction',
          onclick() {
            transactionService().broadcast(self._rawtx).then(() => {
              showSuccess('Transaction Broadcasted')
            })
          }
        });
      }
    },
    $$: [
      { $virus: selectGroupism('Network', _.keys(networks), 'bitcoin'),
        name: 'network',
        $update(){ this.value = this._networkName },
        onchange(e: Event){ this._networkName = (<HTMLInputElement>e.target).value }
      },
    ]
  }
}
