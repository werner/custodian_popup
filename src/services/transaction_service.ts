import * as jQuery from 'jquery';
import config from '../config';

import {baseService} from './base_service.js'

export function transactionService() {
  return {
    broadcast (hash: JQuery.PlainObject) {
      return jQuery.ajax({
        method: 'POST',
        url: `${config.rootUrl}/transactions/broadcast`,
        contentType: 'application/json; charset=utf-8',
        data: hash,
        crossDomain: true
      })
    }
  }
}
