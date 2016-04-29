import { Row, Cell } from './grid';
import compose, { ComposeFactory } from "dojo-compose/compose";

export interface _SelectionBase {
	_isSelected(object: any, selectionClassName: string): boolean;
	_isRow(object: any): object is Row;
	_isCell(object: any): object is Cell;
}

/**
 * This module contains common functionality used by both CellSelectionMixin and SelectionMixin
 */
export default compose({
	/**
	 * Determines whether the passed in item is currently selected
	 * is selected
	 */
    _isSelected(object: any, selectionClassName: string) {
		if (this._isRow(object) || this._isCell(object)) {
			return object.element && object.element.classList.contains(selectionClassName);
		}
		return false;
	},

	/**
	 * Verify that the passed in object is a row
	 */
    _isRow(object:any): object is Row {
		return object && typeof object === 'object' && 'element' in object;
	},

	/**
	 * Verify that the passed in object is a cell
	 */
    _isCell(object:any): object is Cell {
		return object && typeof object === 'object' && 'row' in object;
	}
});
