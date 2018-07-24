import * as $ from "jquery";
(<any>window).jQuery = (<any>window).$ = $;
import * as _  from 'lodash';
(<any>window)._ = _;
(<any>window).nodeUrl = 'http://localhost:8000';
import * as Popper from 'popper.js';
(<any>window).Popper = Popper;
import * as bitcoin from 'bitcoinjs-lib';
(<any>window).bitcoin = bitcoin;
require('./lib/bootstrap.min.js');

import * as device from './device.js';
import {showInfo, showError, loading, notLoading} from './messages.js';
import {loadDeviceHandler} from './load_device_handler.js';
import {multisigSetupHandler} from './multisig/index.js';
import {signingHandler} from './signing_handler.js';
import {debuggerHandler} from './debugger_handler.js';
import {walletHandler} from './wallets_handler.js';
import {hamlism} from './lib/hamlism.js';
import {tabbism} from './lib/bootstrapism.js';
import {updateEpidemic} from './lib/update_epidemic.js';

(<any>window).app = {
  $cell: true,
  $tag: 'body.container',
  $virus: [hamlism, tabbism, updateEpidemic],
  _networkName: 'bitcoin',
  $$: [
    signingHandler(),
    multisigSetupHandler(),
    loadDeviceHandler(),
    debuggerHandler(),
    walletHandler()
  ],
}
