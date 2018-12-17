import {
  buttonism,
  buttonismWithSize,
  formGroupism
} from "../lib/bootstrapism";
import { hamlism } from "../lib/hamlism";
import { updateEpidemic } from '../lib/update_epidemic';
import { showError, loading, notLoading } from "../messages";
import { CustodianManager } from "../services/custodian_manager";
import config from "../config";
import { WalletService } from '../services/wallet_service';
var bip32 = require("bip32");

export function hdNodesManager() {
  return {
    class: "well well-sm",
    id: 'hd-nodes-manager',
    $virus: updateEpidemic,
    _path: "[]",
    _wallets: (<any>window).wallets,
    _setPath: function(string: string) {
      this._path = string ? bip32.fromString(string).toPathArray() : [];
    },
    _address: "",
    _xpub: "",
    _balance: " Balance: 0",
    async _hdNodeFromTrezor() {
      let networkName = this._networkName;
      loading();
      let _raw_path =
        typeof this._path === "string" ? JSON.parse(this._path) : this._path;
      let _path =
        _raw_path.length === 0
          ? config._chooseDerivationPath(networkName)
          : this._path;
      const result = await (<any>window).TrezorConnect.getPublicKey({
        path: _path,
        coin: networkName
      });
      if (result.success) {
        this._addHdNodeFromXpub(result.payload.xpub);
        notLoading();
      } else {
        showError(result.payload.error);
      }
    },
    _addHdNodeFromXpub(xpub: string) {
      let networkName = this._network();
      let hdNode = bip32.fromBase58(xpub, networkName);
      hdNode.getAddress = (path: number[], coin: string) => {
        return (<any>window).TrezorConnect.getAddress({ path, coin });
      };
      this._xpubs.push(xpub);
      this._hdNodes.push(hdNode);
    },
    _hdNodeContainer(hdNode: any) {
      let self = this;
      let networkName = this._networkName;
      let path = config._chooseDerivationPath(networkName);
      hdNode.getAddress(path, networkName).then((result: any) => {
        if (result.success) {
          self._address = result.payload.address;
          (<any> window.document.getElementsByClassName('address-text')[0]).textContent = result.payload.address;
        }
      });
      return {
        $virus: hamlism,
        _toRskAddress: "",
        _fromRskAddress: "",
        $tag: "li.list-group-item",
        _chooseAddressTypeByWallet: (walletType: string) => {
          switch (walletType) {
            case 'plain_wallets':
              return 'plain_addresses'
            case 'hd_wallets':
              return 'hd_addresses'
            case 'multisig_wallets':
              return 'multisig_addresses'
          }
        },
        _createAddressByWallet: (address: string, walletType: string, walletName: string) => {
          switch (walletType) {
            case 'plain_wallets':
              return CustodianManager(config)._createPlainAddress(address, walletName);
            case 'hd_wallets':
              return CustodianManager(config)._createHdAddress(address, walletName);
            case 'multisig_wallets':
              return CustodianManager(config)._createMultisigAddress(address, walletName);
          }
        },
        $$: [
          {
            $tag: "button.close",
            $text: "×",
            onclick(e: Event) {
              self._hdNodes = (<any>window)._.without(self._hdNodes, hdNode);
            }
          },
          {
            $tag: "p span",
            $$: [
              {
                $tag: "span",
                class: 'address-text'
              }
            ]
          },
          {
            $tag: "input.form-control.form-control-sm",
            value: hdNode.neutered().toBase58(),
            readonly: true
          },
          {
            $virus: hamlism,
            $tag: ".float-sm-right ",
            class: "wallet-creation",
            $$: [
              {
                $tag: ".row",
                $$: [
                  {
                    $tag: ".col-lg",
                    $$: [
                      {
                        $virus: buttonismWithSize(
                          "Create Hd Wallet",
                          "success",
                          "small"
                        ),
                        "data-id": "hd-wallet-creation",
                        onclick() {
                          config.nodeSelected = config._chooseBackUrl(
                            self._networkName
                          );
                          CustodianManager(config)._sendHdToCustodian(hdNode);
                        }
                      }
                    ]
                  },
                  {
                    $tag: ".col-lg",
                    $$: [
                      {
                        $virus: buttonismWithSize(
                          "Create Plain Wallet",
                          "success",
                          "small"
                        ),
                        onclick() {
                          config.nodeSelected = config._chooseBackUrl(
                            self._networkName
                          );
                          CustodianManager(config)._sendPlainToCustodian(
                            hdNode
                          );
                        }
                      }
                    ]
                  },
                  {
                    $tag: ".col-lg",
                    $$: [
                      {
                        id: 'add-to-wallet',
                        $placeholder: "Add to wallet",
                        $type: "select",
                        class: "form-control",
                        name: "wallet_select",
                        onchange(e: Event) {
                          let type = (<HTMLInputElement>e.target).value;
                          let walletName = (<HTMLSelectElement>document.getElementById('add-to-wallet')).selectedOptions[0].text;
                          let walletService = WalletService(config);
                          walletService.create(`/${this._chooseAddressTypeByWallet(type)}`, 
                                               this._createAddressByWallet(hdNode.getAddress(), type, walletName));
                        },
                        $$: [
                          {
                            $type: "option",
                            $text: "Add to Wallet",
                            value: "Add to Wallet"
                          }
                        ].concat(
                          (<any>window)._.map(
                            this._wallets,
                            (address: { attributes: { label: string }, type: string }) => {
                              return {
                                $type: "option",
                                $text: address.attributes.label,
                                value: address.type
                              };
                            }
                          )
                        )
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };
    },
    $$: [
      { $type: "h4", $text: "1. Add some HD nodes" },
      {
        $virus: formGroupism("Derive a path?"),
        $tag: "input#multisig_setup_path",
        $help: `Derive this path from the provided xpub or trezor, and add that
          HD node instead instead of the root one.
          Mostly useful when just deriving single addresses from trezor.`,
        name: "path",
        placeholder: "You'll likely won't need this",
        type: "text",
        onchange(e: Event) {
          this._setPath((<HTMLInputElement>e.target).value);
        }
      },
      {
        class: "form-group input-group",
        $$: [
          { $tag: "span.input-group-addon", $text: "Existing Xpub" },
          {
            $tag: "input#multisig_setup_xpub.form-control",
            name: "xpub",
            type: "text",
            $update() {
              this.value = this._xpub;
            },
            onchange(e: Event) {
              this._xpub = (<HTMLInputElement>e.target).value;
            }
          },
          {
            class: "input-group-btn add-node-group",
            $$: [
              {
                $virus: buttonism("Add node"),
                onclick() {
                  try {
                    this._addHdNodeFromXpub(this._xpub);
                  } catch (error) {
                    showError(error);
                  }
                }
              }
            ]
          }
        ]
      },
      {
        $virus: buttonism("Add node from Trezor"),
        "data-id": "add-node-from-trezor",
        onclick() {
          this._hdNodeFromTrezor();
        }
      },
      {
        $tag: "ul.list-group.hd-nodes.mt-3",
        $update() {
          this.innerHTML = "";
          (<any>window)._.each(this._hdNodes, (n: any) =>
            this.$build(this._hdNodeContainer(n))
          );
        }
      }
    ]
  };
}
