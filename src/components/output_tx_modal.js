import $ from 'jquery'
import { hamlism } from '../lib/hamlism'
import { buttonism, buttonismWithSize, selectObjectGroupism } from '../lib/bootstrapism'
import { Transaction } from '../lib/transaction'
import { updateEpidemic } from '../lib/update_epidemic'
import { showError } from '../messages'

export function modalTx () {
  return {
    id: 'modalDialogTx',
    class: 'modal fade',
    role: 'dialog',
    $virus: updateEpidemic,
    _scriptType: '',
    _address: '',
    _amount: 0,
    _outputs: [],
    _totalAmount: 0,
    _updateAmount () {
      this._amount = this._totalAmount - this._outputs.reduce((acc, tx) => acc + parseFloat(tx.amount), 0)
    },
    $$: [
      {
        class: 'modal-dialog modal-lg',
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
                    $text: 'Please add output parameters'
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
                    class: 'messages'
                  },
                  {
                    $virus: selectObjectGroupism('Script Type', [
                      {
                        id: '',
                        text: 'Select a script type'
                      }, {
                        id: 'PAYTOADDRESS',
                        text: 'PAYTOADDRESS'
                      }, {
                        id: 'PAYTOSCRIPTHASH',
                        text: 'PAYTOSCRIPTHASH'
                      }
                    ], 'script_type'),
                    name: 'script_type',
                    $update () {
                      this.value = this._scriptType
                    },
                    onchange (e) {
                      this._scriptType = e.target.value
                    }
                  },
                  {
                    class: 'form-group input-group',
                    $$: [
                      {
                        $tag: 'input',
                        name: 'address',
                        id: 'address',
                        class: 'form-control',
                        placeholder: 'Address',
                        type: 'text',
                        $update () {
                          this.value = this._address
                        },
                        onchange (e) {
                          this._address = e.target.value
                        }
                      }, {
                        class: 'input-group-btn add-node-group',
                        $$: [{
                          $virus: buttonism('RSK'),
                          async onclick () {
                            try {
                              let transaction = new Transaction()
                              this._address = await transaction.getFederationAdress(this._networkName.charAt(0).toUpperCase() + this._networkName.slice(1))
                              document.querySelector('#modalDialogTx').$update()
                            } catch (error) {
                              showError(error)
                            }
                          }
                        }]
                      }]
                  },
                  {
                    $tag: 'input',
                    name: 'amount',
                    id: 'amount',
                    class: 'form-control',
                    placeholder: 'Amount',
                    type: 'number',
                    $update () {
                      this.value = this._amount
                    },
                    onchange (e) {
                      this._amount = e.target.value
                    }
                  },
                  {
                    $tag: 'table.table.table-outputs-tx',
                    $$: [{
                      $tag: 'thead',
                      $$: [{
                        $tag: 'tr',
                        $$: [{
                          $tag: 'th',
                          $text: 'Script Type'
                        }, {
                          $tag: 'th',
                          $text: 'Address'
                        }, {
                          $tag: 'th',
                          $text: 'Amount'
                        }, {
                          $tag: 'th',
                          $text: ''
                        }]
                      }]
                    }, {
                      $tag: 'tbody',
                      _fillOutputs (output) {
                        let self = this
                        return {
                          $tag: 'tr',
                          $virus: hamlism,
                          $$: [{
                            $tag: 'td',
                            $text: output.script_type
                          }, {
                            $tag: 'td',
                            $text: output.address
                          }, {
                            $tag: 'td',
                            $text: output.amount
                          }, {
                            $tag: 'button.close.del-utxo',
                            'aria-label': 'Close',
                            $$: [
                              {
                                $tag: 'span',
                                'aria-hidden': true,
                                $text: 'x'
                              }
                            ],
                            onclick () {
                              self.outputs = self.outputs.filter(_output => _output !== output)
                              self._updateAmount()
                            }
                          }]
                        }
                      },
                      $update () {
                        this.innerHTML = ''
                        this._outputs.forEach((output) => this.$build(this._fillOutputs(output)))
                      }
                    }]
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
                    $tag: 'button.btn.btn-success',
                    'data-id': 'add-output-tx',
                    $text: 'Add',
                    onclick () {
                      this._outputs.push({ script_type: this._scriptType, address: this._address, amount: this._amount })
                      this._updateAmount()
                    }
                  },
                  {
                    $virus: buttonismWithSize('Create', 'primary', 'small'),
                    'data-dismiss': 'modal',
                    'data-id': 'create-tx',
                    onclick () {
                      let self = this
                      let transaction = new Transaction()
                      transaction.createTx(self, this._networkName).then((tx) => {
                        document.querySelector('#signing')._transactionJson = tx
                        document.querySelector('#signing').$update()
                      })
                      $('.nav-pills a[href="#tab_signing"]').tab('show')
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
