import * as $ from "jquery";
type Message = () => void;

function message(type: string, text: string, extra: string, hide: boolean) {
  if ( $("body > #messages").length === 0 ) {
    $("body").prepend("<div id='messages' class='mt-2'/>")
  }
  
  let el = $(`<div class="alert alert-${type} ${extra}">${text}</div>`)
  $("#messages").append(el)
  if (hide) {
    setTimeout(() => { el.hide() }, 5000)
  }
};

export function showError(text: string) {
  return message("danger", text, null, true);
};

export function showInfo(text: string) {
  return message("info", text, null, true)
}

export function showSuccess(text: string) {
  return message("success", text, null, true)
}

export function loading() {
  if ($("#messages > .loading").length === 0) {
    message("info", "Loading", 'loading', false)
  }
}

export function notLoading() {
  return $("#messages").find('.loading').remove()
}
