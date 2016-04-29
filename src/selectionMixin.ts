import { Row } from './grid';
import _selectionBaseMixin, { _SelectionBase } from './_selectionBaseMixin';
import { ComposeFactory } from "dojo-compose/compose";


export interface Selection {
	select: (row: string | number | Row, toRow?: number, value?: boolean) => void;
	isSelected: (object: Row | { id?: string }) => boolean;
	row: (target: { id?: string } | string | number) => Row;
	domNode: Element;
}

/**
 * A mixin that extends a grid to provide the ability to select individual rows.
 * Unlike decorator, editor, and pagination, the selection mixins do not require any additional initialization
 * logic or to modify existing parts of the grid lifecycle, so they just export a ComposeFactory that can be used
 * as a mixin, rather than a custom mixin object.
 *
 * We cast the export so that only the Selection interface is exposed to consumers
 */
export default <ComposeFactory<Selection, {}>> _selectionBaseMixin.mixin({
	mixin: <Selection> {
		select: function (row:string | number | Row, toRow?:number, value?:boolean) {
			const selection: Selection & _SelectionBase = this;
			let rowDomNodes: Element[] = [];
			if (selection._isRow(row)) {
				rowDomNodes.push(row.element);
			} else if (typeof row === 'string') {
				rowDomNodes.push(selection.row(row).element);
			} else {
				rowDomNodes = rowDomNodes.concat(Array.prototype.slice.call(
					selection.domNode.querySelectorAll('.row'),
					row,
					toRow ? toRow : row + 1)
				);
			}
			rowDomNodes.forEach(rowDomNode => typeof value === 'boolean' ?
				rowDomNode.classList.toggle('selected', value) : rowDomNode.classList.toggle('selected')
			);
		},

		isSelected: function (object: Row | { id?: string }) {
			const selection: Selection & _SelectionBase = this;
			selection._isSelected(selection.row(object), 'selected');
		}
	}
});

