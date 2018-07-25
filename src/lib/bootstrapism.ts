import * as _  from 'lodash';
import { Cell } from '../types/index';
import { hamlism } from './hamlism.js';

export function formGroupism(label: string): Function {
  return function(component: any){
    delete component.$virus;
    component.class = 'form-control';

    var $$ = [
      { $tag: 'span.input-group-addon', $text: label },
      component
    ];

    if(component.$help){
      $$.push({
        $init(){ $(this).popover({ trigger: 'focus' }) },
        $tag: "span.input-group-btn a.btn.btn-secondary",
        $text: "?",
        role: 'button',
        tabindex: 0,
        'data-toggle': 'popover',
        'data-trigger': 'focus',
        'title': component.$help_title || "What's this?",
        'data-content': component.$help
      });
    }

    return hamlism({ class: 'form-group input-group', $$ });
  }
}

export function formCheckism(label: string): Function {
  return function(component: Cell){
    delete component.$virus;
    (<any>Object).assign(component, {
      $type: 'input',
      type: 'checkbox',
      class: 'form-check-input'
    });

    return hamlism({
      class: 'form-check',
      $components: [
        { $type: 'label',
          for: component.id,
          class: 'form-check-label',
          $components: [ component, { $type: 'span', $text: label } ]
        }
      ]
    });
  }
}

export function selectGroupism(label: string, options: Array<string>): (component: Cell) => Cell {
  return function(component: Cell) {
    let select = (<any>Object).assign(component, {
      $type: 'select',
      class: 'form-control',
      $components: _.map(options, (name) => {
        return {$type: 'option', $text: name, value: name}
      })
    })

    return hamlism({ class: 'form-group input-group', $$: [
      { $tag: 'span.input-group-addon', $text: label },
      select
    ]})
  }
}

export function selectObjectGroupism(label: string, options: Array<{text: string, id: number}>) {
  return function(component: Cell){
    let select = (<any>Object).assign(component, {
      $type: 'select',
      class: 'form-control',
      $components: _.map(options, (obj) => {
        return {$type: 'option', $text: obj.text, value: obj.id}
      })
    })

    return hamlism({ class: 'form-group input-group', $$: [
      { $tag: 'span.input-group-addon', $text: label },
      select
    ]})
  }
}

export function buttonism(label: string, kind: string = 'primary') {
  return function(component: Cell){
    return hamlism(_.merge(component, {
      $tag: `button.btn.btn-block.btn-${kind}`,
      $text: label
    }))
  }
}

export function buttonismWithSize(label: string, kind: string = 'primary', size: string = 'block') {
  return function(component: Cell){
    return hamlism(_.merge(component, {
      $tag: `button.btn.btn-${size}.btn-${kind}`,
      $text: label
    }))
  }
}

export function cardism(header: string){
  return function(component: Cell){
    return hamlism({
      $tag: '.card.my-3',
      $$: [
        { $tag: '.card-header', $text: header },
        { $tag: '.card-body', $$: [component] }
      ]
    })
  }
}

export function tabbism(component: any): Cell {
  let navs = _.map(component.$components, (tab) => {
    return hamlism({
      $tag: 'li.nav-item',
      $init(){
        $(this).on('shown.bs.tab', function (e) {
          $(`#tab_${tab.id}`).find("input:first").focus() 
        })
      },
      $$: [{
        $tag: 'a.nav-link',
        "data-toggle": 'tab',
        href: `#tab_${tab.id}`,
        role: 'tab',
        $text: _.upperFirst(_.lowerCase(tab.id))
      }]
    })
  });

  let tabs = _.map(component.$components, (tab) => {
    return { 
      class: 'tab-pane',
      id: `tab_${tab.id}`,
      role: 'tabpanel',
      $components: [tab]
    }
  });

  let initial = component.$components[0].id;
  component.$init = function(){
    $(`.nav-pills a[href="#tab_${initial}"]`).tab('show')
  };
  component.$components = [
    { $type: 'ul', class: 'nav nav-pills', role: 'tablist', $components: navs },
    { class: 'tab-content', $components: tabs },
  ];

  return component;
}
