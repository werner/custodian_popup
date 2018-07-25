import { Virus, Gene } from '../types/index';

export function updateEpidemic (component: Gene): Gene {
	let recursive_update = (node: Element) => {
		for(let n of node.children){
			n.$update && n.$update()
			recursive_update(n)
		}
	}

	let old_update = component.$update

	component.$update = function(){
		old_update && old_update.call(this)
		recursive_update(this)
	}

	return component
}

