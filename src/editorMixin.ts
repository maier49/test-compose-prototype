import { AspectAdvice } from 'dojo-compose/compose';

/**
 * The Editor mixin uses a class as its base simply because the fact that its property has the type of an array of
 * strings can be expressed in a more straightforward manner using a class. In order to express that with an interface
 * or anonymous type the type would have to be created, as well as an object to cast to that type.
 */
export class Editor {
	editableFields: string[];
}

/**
 * The Editor mixin uses an aspect to wrap around and modify the renderRow method on a grid.
 * @type {{around: {renderRow: (function(function({}): Node): function({}): Node)}}}
 */
const editorAdvice: AspectAdvice = {
	'around': {
		renderRow: function (inherited: (item: { [ index: string ]: string }) => Node): (item: { [index: string ]: string }) => Node {
			return function (item: { [index: string ]: string }) {

				let row: Node = inherited.call(this, item);

				this.editableFields.forEach(function (editableField: string) {
					let cell: Node = (<any> row).querySelector('.field-' + editableField);
					let newCell: any = document.createElement('input');
					newCell.setAttribute('type', 'text');

					newCell.value = cell.textContent;

					row.replaceChild(newCell, cell);
				});

				return row;
			};
		}
	}
};

/**
 * Initialization function for the Editor mixin
 * @param grid
 * @param options
 */
function editorInit(grid: Editor, options: { [ index: string ]: any }) {
	grid.editableFields = options['editableFields'];
}

export default {
	mixin: Editor,
	initialize: editorInit,
	aspectAdvice: editorAdvice
};
