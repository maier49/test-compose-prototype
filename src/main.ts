import { list } from './List';
import { pagination } from './Pagination';
import { editor } from './Editor';
import { decorator } from './Decorator';
import compose from 'dojo-compose/compose';
import { before } from 'dojo-compose/aspect';

const columns: {name: string, field: string}[] = [
	{ name: 'First Name', field: 'first' },
	{ name: 'Last Name', field: 'last' }
];

const listFactory = compose({}).mixin(list);
const paginatedListFactory = listFactory.mixin(pagination);
const editorFactory = listFactory.mixin(editor);
const paginatedEditorDecoratorListFactory = listFactory
	.mixin(pagination)
	.mixin(editor)
	.mixin(decorator);

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

const editorList = editorFactory({
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
