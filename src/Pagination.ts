import { AspectAdvice } from 'dojo-compose/compose';
export class Pagination {
	rowsPerPage: number;
	pageNumber: number;
	data: { [ index: string ]: string }[];
	render: (data: { [ index: string ]: string }[]) => void;
	gotoPage(page: number): void {
		this.pageNumber = page;
		this.render(this.data);
	}
};

export function PaginationAdvice() {
	const aspectAdvice: AspectAdvice = {
		'around': {
			render: function (inherited: (data: { [ index: string ]: string }[]) => void): (data: { [index: string ]: string }[]) => void {
				return function (data: { [index: string ]: string }[]) {
					const start = this.pageNumber * this.rowsPerPage;
					const end = start + this.rowsPerPage;
					this.data = data;

					inherited.call(this, data.slice(start, end));

					let paginationNode = this.domNode.querySelector('.paginationNode');
					if (paginationNode) {
						this.domNode.removeChild(paginationNode);
					}

					paginationNode = document.createElement('div');
					paginationNode.classList.add('paginationNode');
					let nextButton = document.createElement('button');
					let previousButton = document.createElement('button');
					nextButton.textContent = 'Next';
					previousButton.textContent = 'Previous';

					nextButton.onclick = function () {
						this.gotoPage(this.pageNumber + 1)
					}.bind(this);

					previousButton.onclick = function () {
						this.gotoPage(this.pageNumber - 1)
					}.bind(this);

					paginationNode.appendChild(previousButton);
					paginationNode.appendChild(nextButton);

					this.domNode.appendChild(paginationNode);
				};
			}
		}
	};
	return aspectAdvice;
};

export function PaginationInit(options: { [index: string ]: any }) {
	this.rowsPerPage = options['rowsPerPage'];
	this.pageNumber = options['pageNumber']
}
