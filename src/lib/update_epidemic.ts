import { Virus, Cell } from '../types/index';

export function updateEpidemic (component: Cell): Cell {
	let recursive_update = (node: ParentNode) => {
		for(let n of [].slice.call(node.children)){
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

