import { AspectAdvice } from 'dojo-compose/compose';
export class Decorator {
	color: string;
	fieldsToDecorate: string[];
}

export function DecoratorAdvice() {
	const aspectAdvice: AspectAdvice = {
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
	return aspectAdvice;
};

export function DecoratorInit(options: { [ index: string ]: any }) {
	this.color = options['color'];
	this.fieldsToDecorate = options['fieldsToDecorate'];
}
