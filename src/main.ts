import { List, ListInit } from './List';
import { Pagination, PaginationAdvice, PaginationInit } from './Pagination';
import { Editor, EditorInit, EditorAdvice } from './Editor';
import { Decorator, DecoratorInit, DecoratorAdvice } from './Decorator';
import compose from 'dojo-compose/compose';
import { before } from 'dojo-compose/aspect';

const columns: {name: string, field: string}[] = [
	{ name: 'First Name', field: 'first' },
	{ name: 'Last Name', field: 'last' }
];

const ListClass = compose(List, ListInit);
const PaginatedList = compose(List, before(ListInit, PaginationInit)).mixin(Pagination).aspect(PaginationAdvice());
const EditorList = compose(List, before(ListInit, EditorInit)).mixin(Editor).aspect(EditorAdvice());
const PaginatedEditorDecoratorList = compose(List,
	before(before(before(ListInit, PaginationInit), EditorInit), DecoratorInit))
	.mixin(Pagination)
	.aspect(PaginationAdvice())
	.mixin(Editor)
	.aspect(EditorAdvice())
	.mixin(Decorator)
	.aspect(DecoratorAdvice());

const data: { [ index: string ]: string }[] = [
	{ first: 'Bob', last: 'The Builder' },
	{ first: 'Homer', last: 'Simpson' },
	{ first: 'Tom', last: 'Hanks' }
];

const basicList = new ListClass({domNode: document.body.querySelector('#grid'), columns: columns });
basicList.render(data);

const paginatedList = new PaginatedList({
	rowsPerPage: 1,
	pageNumber: 1,
	domNode: document.body.querySelector('#paginated'),
	columns: columns
});
paginatedList.render(data);

const editorList = new EditorList({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#editor')
});
editorList.render(data);

const mixedList = new PaginatedEditorDecoratorList({
	editableFields: [ 'first' ],
	columns: columns,
	domNode: document.body.querySelector('#combo'),
	rowsPerPage: 1,
	pageNumber: 1,
	fieldsToDecorate: [ 'last' ],
	color: 'red'
});

mixedList.render(data);
