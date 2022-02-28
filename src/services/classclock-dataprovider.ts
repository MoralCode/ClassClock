
import { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import { fetchUtils, DataProvider } from 'ra-core';
import ClassClockService from './classclock';

/**
 * Maps react-admin queries to the ClassClock API
 *
 *
 * @example
 *
 * getList          => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * getOne           => GET http://my.api.url/posts/123
 * getManyReference => GET http://my.api.url/posts?author_id=345
 * getMany          => GET http://my.api.url/posts?id=123&id=456&id=789
 * create           => POST http://my.api.url/posts/123
 * update           => PUT http://my.api.url/posts/123
 * updateMany       => PUT http://my.api.url/posts/123, PUT http://my.api.url/posts/456, PUT http://my.api.url/posts/789
 * delete           => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import jsonServerProvider from 'ra-data-json-server';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
export default (apiUrl: string, getTokenSilently: (o?: GetTokenSilentlyOptions) => Promise<string>, httpClient = fetchUtils.fetchJson): DataProvider => ({
	getList: async (resource, params) => {
		// const { page, perPage } = params.pagination;
		// const { field, order } = params.sort;
		// const query = {
		// 	...fetchUtils.flattenObject(params.filter),
		// 	_sort: field,
		// 	_order: order,
		// 	_start: (page - 1) * perPage,
		// 	_end: page * perPage,
		// };
		const token: string = await getTokenSilently()
		const url = `${apiUrl}/${resource}`;

		return ClassClockService.makeAPICall("GET", url, token).then(async response => {
			// if (!headers.has('X-Total-Count')) {
			// 	throw new Error(
			// 		'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
			// 	);
			// }
			var data = await response.json()//.data
			return Object.assign({},
				data,
				{
					total: parseInt(
						(response.headers.get('X-Total-Count')?? "1").split('/').pop()?? "1",
						10
					),
				}
			);
		});
	},

	getOne: (resource, params) =>{
		const token: string = await getTokenSilently()
		return ClassClockService.makeAPICall("GET", `${apiUrl}/${resource}/${params.id}`, token).then(async response => {
			let json = await response.json();
			return {
				data: json,
			}
		});
	}
	//make separate queries for each item because the classclock API doesnt support getting a specific set at once
	getMany: (resource, params) => {
		const token: string = await getTokenSilently();
		return Promise.all(
			params.ids.map(id => {
				return ClassClockService.makeAPICall("GET", `${apiUrl}/${resource}/${id}`, token).then(async response => response.json());
			})
		).then(responses => ({ data: responses.map(({ json }) => json.id) }))
	},

	getManyReference: (resource, params) => {
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		const query = {
			...fetchUtils.flattenObject(params.filter),
			[params.target]: params.id,
			_sort: field,
			_order: order,
			_start: (page - 1) * perPage,
			_end: page * perPage,
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;

		return httpClient(url).then(({ headers, json }) => {
			if (!headers.has('x-total-count')) {
				throw new Error(
					'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
				);
			}
			return {
				data: json,
				total: parseInt(
					headers.get('x-total-count').split('/').pop(),
					10
				),
			};
		});
	},

	update: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`, {
			method: 'PATCH',
			body: JSON.stringify(params.data),
		}).then(({ json }) => ({ data: json })),

	// json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
	updateMany: (resource, params) =>
		Promise.all(
			params.ids.map(id =>
				httpClient(`${apiUrl}/${resource}/${id}`, {
					method: 'PATCH',
					body: JSON.stringify(params.data),
				})
			)
		).then(responses => ({ data: responses.map(({ json }) => json.id) })),

	create: (resource, params) =>
		httpClient(`${apiUrl}/${resource}`, {
			method: 'POST',
			body: JSON.stringify(params.data),
		}).then(({ json }) => ({
			data: { ...params.data, id: json.id },
		})),

	delete: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`, {
			method: 'DELETE',
		}).then(({ json }) => ({ data: json })),

	// json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
	deleteMany: (resource, params) =>
		Promise.all(
			params.ids.map(id =>
				httpClient(`${apiUrl}/${resource}/${id}`, {
					method: 'DELETE',
				})
			)
		).then(responses => ({ data: responses.map(({ json }) => json.id) })),
});