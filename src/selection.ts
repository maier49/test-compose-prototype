import { Row } from './grid';

export function isRow(object: any): object is Row {
	return typeof object === 'object' && 'element' in object && 'data' in object;
}

export interface Selection {
	select: (row: string | number | Row, toRow?: number, value?: boolean) => void;
	isSelected: (object: Row | { id?: string }) => boolean;
	row: (target: { id?: string } | string | number) => Row;
	domNode: Element;
}

const selection = {
	select: function (row: string | number | Row, toRow?: number, value?: boolean) {
		let rowDomNodes: Element[] = [];
		if (isRow(row)) {
			rowDomNodes.push(row.element);
		} else if (typeof row === 'string') {
			rowDomNodes.push(this.row(row).element);
		} else {
			rowDomNodes = rowDomNodes.concat(Array.prototype.slice.call(
					this.domNode.querySelectorAll('.row'),
					row,
					toRow ? toRow : row + 1)
			);
		}
		rowDomNodes.forEach(rowDomNode => typeof value === 'boolean' ?
				rowDomNode.classList.toggle('selected', value) : rowDomNode.classList.toggle('selected')
		);
	},

	isSelected: function (object: Row | { id?: string }) {
		// summary:
		//		Returns true if the indicated row is selected.

		if (typeof object === 'undefined' || object === null) {
			return false;
		}

		if (!isRow(object) || (isRow(object) && !object.element)) {
			object = this.row(object);
		}

		if (isRow(object)) {
			return object && object.element && object.element.classList.contains('row');
		}
	}

	//row: <(target: { id?: string } | string | number) => Row> null,

	//domNode: <Element> null
};
export default <Selection> selection;
