import { AspectAdvice } from 'dojo-compose/compose';
export class Decorator {
	color: string;
	fieldsToDecorate: string[];
}

const decoratorAdvice: AspectAdvice = {
	'after': {
		renderRow: function (row: Node, ...args: any[]): Node {
			this.fieldsToDecorate.forEach(function (field: string) {
				Array.prototype.forEach.call((<any> row).querySelectorAll('.field-' + field),
					function (cell: HTMLElement) {
						cell.style.color = this.color;
					}, this);
			}, this);

			return row;
		}
	}
};

function decoratorInit(grid: Decorator, options: { [ index: string ]: any }) {
	grid.color = options['color'];
	grid.fieldsToDecorate = options['fieldsToDecorate'];
}

export const decorator = {
	base: Decorator,
	initializer: decoratorInit,
	aspectAdvice: decoratorAdvice
};
