import { AspectAdvice } from 'dojo-compose/compose';

/**
 * As with the Editor mixin and Pagination mixins, the Decorator mixing uses a class to describe its base type simply because it is
 * more concise.
 */
export class Decorator {
	color: string;
	fieldsToDecorate: string[];
}

/**
 * Executes additional logic after render row to 'decorate' a row. In this case the cell simply has an inline style
 * added to it to set its font color, but this pattern is how a row's dom can be tweaked without having to completely
 * override the base renderRow method.
 * @type {{after: {renderRow: (function(Node, ...[any]): Node)}}}
 */
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

type decoratorOptions = {
	fieldsToDecorate?: string[],
	color?: string
}
function decoratorInit(instance: Decorator, options: decoratorOptions) {
	instance.color = options['color'];
	if (options.fieldsToDecorate) {
		instance.fieldsToDecorate = options.fieldsToDecorate;
	}
}

export default {
	mixin: Decorator,
	initialize: decoratorInit,
	aspectAdvice: decoratorAdvice
};
