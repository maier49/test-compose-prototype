import { AspectAdvice } from 'dojo-compose/compose';
export class Decorator {
	color: string;
	fieldsToDecorate: string[];
}

export const decoratorAdvice: AspectAdvice = {
	'after': {
		renderRow: function (row: Node, ...args: any[]): Node {
			this.fieldsToDecorate.forEach(function (field: string) {
				Array.prototype.forEach.call((<any> row).querySelectorAll('.field-' + field),
					function (cell: HTMLElement) {
						cell.style.color = this.color;
					}.bind(this));
			}.bind(this));

			return row;
		}
	}
};

export function decoratorInit(options: { [ index: string ]: any }) {
	this.color = options['color'];
	this.fieldsToDecorate = options['fieldsToDecorate'];
}
