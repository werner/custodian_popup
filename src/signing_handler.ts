import * as _  from 'lodash';

import { selectGroupism } from './lib/bootstrapism';
import { transactionService } from './services/transaction_service';
import { showSuccess } from './messages';

import { Virus, Cell } from './types/index';
import { updateEpidemic } from './lib/update_epidemic';
import networks from './lib/networks';
import { Transaction } from './lib/transaction';

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
      { $virus: selectGroupism('Network', _.keys(networks)),
        name: 'network',
        $update(){ this.value = this._networkName },
        onchange(e: Event){ this._networkName = (<HTMLInputElement>e.target).value }
      },
      { $tag: '.form-group textarea#tansaction_json.form-control',
        name: 'transaction_json',
        rows: 15,
        onchange(e: Event) { this._transactionJson = (<HTMLInputElement>e.target).value },
        $update() {
          this.$text = JSON.stringify(this._transactionJson, () => true, '  ');
        }
      },
      { $tag: 'button.btn.btn-primary.btn-block.mt-1',
        id: 'sign-transaction',
        $text: 'Sign transaction',
        _handleSigningResult (result: {json: object, done: boolean, rawtx: string}) {
          this._transactionJson = result.json;
          this._rawtx = result.rawtx;
          if (result.done) {
            showSuccess("All signed, try to propagate rawtx")
          }
        },
        onclick () {
          let transaction = new Transaction();
          transaction.signTransaction(this._transactionJson, this._networkName)
            .then(this._handleSigningResult)
        }
      }
    ]
  }
}
