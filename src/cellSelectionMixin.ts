import { Grid, Row, Cell } from './grid';
import _selectionBaseMixin, { _SelectionBase } from './_selectionBaseMixin';
import { ComposeFactory } from "dojo-compose/compose";

export interface CellSelection {
	select(cell: string | number | Cell, toCell?: number, value?: boolean): void;
	isSelected(object: Cell | Element | Event): boolean;
	cell(target: any, columnId?: string): Cell;
	domNode: Element;
}

/**
 * A mixin that extends a grid to provide the ability to select individual cells.
 * Unlike decorator, editor, and pagination, the selection mixins do not require any additional initialization
 * logic or to modify existing parts of the grid lifecycle, so they just export a ComposeFactory that can be used
 * as a mixin, rather than a custom mixin object.
 *
 * We cast the export so that only the CellSelection interface is exposed to consumers
 */
export default <ComposeFactory<CellSelection, {}>> _selectionBaseMixin.mixin({
	mixin: <CellSelection> {
        select: function (cell: string | number | Cell /*| Row */, toCell?: number, value?: boolean) {
			const cellSelector: CellSelection & _SelectionBase = this;
            if (cellSelector._isRow(cell)) {
                return;
            }
            let cellDomNodes: Element[] = [];
            if (cellSelector._isCell(cell)) {
                cellDomNodes.push((<Cell> cell).element);
            } else if (typeof cell === 'string') {
                cellDomNodes.push(cellSelector.cell(cell).element);
            } else if (typeof cell === 'number') {
                cellDomNodes = cellDomNodes.concat(Array.prototype.slice.call(
                    cellSelector.domNode.querySelectorAll('[class*="field-"]'),
                    cell,
                    toCell ? toCell : cell + 1)
                );
            }
            cellDomNodes.forEach(cellDomNode => typeof value === 'boolean' ?
                cellDomNode.classList.toggle('selected-cell', value) : cellDomNode.classList.toggle('selected-cell')
            );
        },

        isSelected: function(object: Cell | Element | Event): boolean {
			const cellSelector: CellSelection & _SelectionBase = this;
			return cellSelector._isSelected(cellSelector.cell(object), 'selected-cell');
        }
	}
});


