import {buttonism, buttonism_with_size} from './lib/bootstrapism.js'
import {update_epidemic} from './lib/update_epidemic.js'

export function modal(addUtxos) {
  return {
    id: 'modalDialog',
    class: 'modal fade',
    role: 'dialog',
    _since: '',
    _limit: '',
    $$: [
      {
        class: 'modal-dialog',
        role: 'document',
        $$: [
          {
            class: 'modal-content',
            $$: [
              {
                class: 'modal-header',
                $$: [
                  {
                    $tag: 'h5',
                    class: 'modal-title',
                    $text: 'Please add since and limit values'
                  },
                  {
                    $tag: 'button.close',
                    'data-dismiss': 'modal',
                    'aria-label': 'Close',
                    $$: [
                      {
                        $tag: 'span',
                        'aria-hidden': true,
                        $text: 'x'
                      }
                    ]
                  }
                ]
              },
              {
                class: 'modal-body',
                $$: [
                  {
                    $tag: 'input',
                    name: 'since',
                    id: 'since-tx',
                    class: 'form-control',
                    placeholder: 'since',
                    type: 'number',
                    $update() {
                      this.value = this._since
                    },
                    onchange(e) {
                      this._since = e.target.value
                    }
                  },
                  {
                    $tag: 'input',
                    name: 'limit',
                    id: 'limit-tx',
                    class: 'form-control',
                    placeholder: 'limit',
                    type: 'number',
                    $update() {
                      this.value = this._limit
                    },
                    onchange(e) {
                      this._limit = e.target.value
                    }
                  }
                ]
              },
              {
                class: 'modal-footer',
                $$: [
                  {
                    $tag: 'button.btn.btn-secondary',
                    'data-dismiss': 'modal',
                    $text: 'Close'
                  },
                  {
                    $virus: buttonism_with_size('Send', 'primary', 'small'),
                    'data-dismiss': 'modal',
                    onclick() {
                      addUtxos.call(this, this._walletType, this._walletId, this._since, this._limit)
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
