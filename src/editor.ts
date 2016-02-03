import { AspectAdvice } from 'dojo-compose/compose';
export class Editor {
	editableFields: string[];
};

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

function editorInit(options: { [ index: string ]: any }) {
	this.editableFields = options['editableFields'];
}

export const editor = {
	base: Editor,
	initializer: editorInit,
	aspectAdvice: editorAdvice
};
