import compose, { AspectAdvice, ComposeFactory } from 'dojo-compose/compose';
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
					}, this);
			}, this);

			return row;
		}
	}
};

export function decoratorInit(options: { [ index: string ]: any }) {
	this.color = options['color'];
	this.fieldsToDecorate = options['fieldsToDecorate'];
}

export function decoratorFactory<O, A>(factory: ComposeFactory<O, A>): ComposeFactory<O, A & Decorator> {
	return compose.mixin(factory, compose(Decorator, decoratorInit)).aspect(decoratorAdvice);
}
