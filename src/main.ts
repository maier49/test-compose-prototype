import { List, ListInit } from './List';
import { Pagination, paginationAdvice, paginationInit } from './Pagination';
import { Editor, editorInit, editorAdvice } from './Editor';
import { Decorator, decoratorInit, decoratorAdvice } from './Decorator';
import compose from 'dojo-compose/compose';
import { before } from 'dojo-compose/aspect';

const columns: {name: string, field: string}[] = [
	{ name: 'First Name', field: 'first' },
	{ name: 'Last Name', field: 'last' }
];

const listFactory = compose(List, ListInit);
const paginatedListFactory = compose(List, ListInit).mixin(compose(Pagination, paginationInit)).aspect(paginationAdvice);
const EditorList = compose(List, ListInit).mixin(compose(Editor, editorInit)).aspect(editorAdvice);
const paginatedEditorDecoratorListFactory = compose(List, ListInit)
	.mixin(compose(Pagination, paginationInit))
	.aspect(paginationAdvice)
	.mixin(compose(Editor, editorInit))
	.aspect(editorAdvice)
	.mixin(compose(Decorator, decoratorInit))
	.aspect(decoratorAdvice);

const data: { [ index: string ]: string }[] = [
	{ first: 'Bob', last: 'The Builder' },
	{ first: 'Homer', last: 'Simpson' },
	{ first: 'Tom', last: 'Hanks' }
];

const basicList = listFactory({domNode: document.body.querySelector('#grid'), columns: columns });
basicList.render(data);

const paginatedList = paginatedListFactory({
	rowsPerPage: 1,
	pageNumber: 1,
	domNode: document.body.querySelector('#paginated'),
	columns: columns
});
paginatedList.render(data);

const editorList = EditorList({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#editor')
});
editorList.render(data);

const mixedList = paginatedEditorDecoratorListFactory({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#combo'),
	rowsPerPage: 1,
	pageNumber: 1,
	fieldsToDecorate: [ 'last' ],
	color: 'red'
});

mixedList.render(data);
