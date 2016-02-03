import { Row, Cell } from './grid';
import compose, { ComposeFactory } from 'dojo-compose/compose';
import Selection, { isRow } from './Selection'

function isCell(object: any): object is Cell {
	return typeof object === 'object' && 'row' in object;
}

export interface CellSelection {
	select(cell: string | number | Cell, toCell?: number, value?: boolean): void;
}

export class _CellSelection {
	//select(row: string | number | Row, toRow?: number, value?: boolean): void;
	select(cell: string | number | Cell /*| Row */, toCell?: number, value?: boolean) {
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
	}

	//isSelected(object: Row, columnId?: string): boolean ;
	isSelected(object: Cell | Element | Event /*| Row */, columnId?: string) {
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
	}

	cell: (target: any, columnId?: string) => Cell;

	domNode: Element;
}

export const cellSelection = {
	// This is what we thought we would like to do, but typescript sees through our plans
	// base: ComposeFactory<any, CellSelection> compose(Selection).mixin({ base: _CellSelection })
	base: compose(Selection).mixin({ base: _CellSelection })
};


