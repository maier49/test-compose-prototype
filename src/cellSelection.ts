import { Row, Cell } from './grid';
import { deepMixin } from 'dojo-core/lang';
import selection, { isRow } from './selection'

function isCell(object: any): object is Cell {
	return typeof object === 'object' && 'row' in object;
}

export interface CellSelection {
	select(cell: string | number | Cell, toCell?: number, value?: boolean): void;
}

const _cellSelection = {
	//select(row: string | number | Row, toRow?: number, value?: boolean): void;
	select: function (cell: string | number | Cell /*| Row */, toCell?: number, value?: boolean) {
		if (isRow(cell)) {
			return;
		}
		let cellDomNodes: Element[] = [];
		if (isCell(cell)) {
			cellDomNodes.push((<Cell> cell).element);
		} else if (typeof cell === 'string') {
			cellDomNodes.push(this.cell(cell).element);
		} else if (typeof cell === 'number') {
			cellDomNodes = cellDomNodes.concat(Array.prototype.slice.call(
					this.domNode.querySelectorAll('[class*="field-"]'),
					cell,
					toCell ? toCell : cell + 1)
			);
		}
		cellDomNodes.forEach(cellDomNode => typeof value === 'boolean' ?
				cellDomNode.classList.toggle('selected-cell', value) : cellDomNode.classList.toggle('selected-cell')
		);
	},

	//isSelected(object: Row, columnId?: string): boolean ;
	isSelected: function(object: Cell | Element | Event /*| Row */, columnId?: string) {
		// summary:
		//		Returns true if the indicated row is selected.

		if (typeof object === 'undefined' || object === null || isRow(object)) {
			return false;
		}

		if (!isCell(object) || (isCell(object) && !(<Cell> object).element)) {
			object = this.cell(object, columnId);
		}

		if (isCell(object)) {
			return object && (<Cell> object).element &&
				(<Cell> object).element.getAttribute('class').indexOf('field-') > -1;
		}
	},

	cell: <(target: any, columnId?: string) => Cell> null,

	domNode: <Element> null
};

/* This is a little weird, as we're not really using any type of inheritance. But, what we really want is an object
 to use as a prototype that has all the properties found in selection, except for those overridden by _cellSelection.
 This would get a little trickier if we needed to do things like aspecting or providing an initialization function,
 but not substantially. In that case, this line could just become
 export const cellSelectionMixin = {
	base: <CellSelection> deepMixin({}, selection, _cellSelection),
 	initializer: initFunction,
 	aspectAdvice: aspectAdvice
 }
 */
export const cellSelection: CellSelection = <CellSelection> deepMixin({}, selection, _cellSelection);


