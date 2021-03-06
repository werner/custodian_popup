import { ClientFunction } from 'testcafe'
import fs from 'fs'

export async function mockJQueryAjax (t, responseCallback) {
  await t.eval(new Function(fs.readFileSync('./node_modules/jquery/dist/jquery.js').toString()))
  await t.eval(new Function(fs.readFileSync('./src/lib/bootstrap.min.js').toString()))

  var clientFunction = ClientFunction((responseCallback) => {
    function ajaxResponse (response) {
      var deferred = $.Deferred().resolve(response).reject(response).catch(response)
      return deferred.promise()
    }
    $.ajax = (params) => {
      return responseCallback(params, ajaxResponse)
    }
  })

  await clientFunction(responseCallback)
}
