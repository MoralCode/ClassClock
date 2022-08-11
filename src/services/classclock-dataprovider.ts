
import { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import { fetchUtils, DataProvider } from 'ra-core';
import ClassClockService from './classclock';

import {DateTime, Interval} from 'luxon';
import { CreateParams, CreateResult, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetManyReferenceParams, GetManyReferenceResult, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams } from 'react-admin';

import { stringify } from 'querystring';
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
export default (apiUrl: string, getTokenSilently: (o?: GetTokenSilentlyOptions) => Promise<string>, httpClient = ClassClockService.makeAPICall): DataProvider => ({
	getList: async (resource: string, params:GetListParams) => {
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
		const url = `${apiUrl}/${resource}s`;

		return httpClient("GET", url, token).then(async response => 
			// if (!headers.has('X-Total-Count')) {
			// 	throw new Error(
			// 		'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
			// 	);
			// }
			// var data = await //.data
			Object.assign({},
				await response.json(),
				{
					total: parseInt(
						(response.headers.get('X-Total-Count')?? "1").split('/').pop()?? "1",
						10
					),
				}
			)
		);
	},

	getOne: async (resource: string, params) =>{
		const token: string = await getTokenSilently()
		return httpClient("GET", `${apiUrl}/${resource}/${params.id}`, token)
			.then(async response => response.json())
			.then(async response => {
				// sort meeting times so they appear int he right order. this is a workaround while waiting for https://github.com/marmelab/react-admin/issues/6601 to be fixed
				if (response.data.hasOwnProperty("meeting_times")) {
					response.data.meeting_times = response.data.meeting_times.sort(function (a: { start_time: string }, b: { start_time: string }) {
						var end = DateTime.fromFormat(a.start_time, "hh:mm:ss");
						var start = DateTime.fromFormat(b.start_time, "hh:mm:ss");
						var i = Interval.fromDateTimes(start, end);
						return i.length('seconds');
					})
				}
				return response
			});
	},
	//make separate queries for each item because the classclock API doesnt support getting a specific set at once
	getMany: async (resource: string, params) => {
		const token: string = await getTokenSilently();
		return Promise.all(
			params.ids.map(id => {
				return ClassClockService.makeAPICall("GET", `${apiUrl}/${resource}/${id}`, token)
				.then(async response => response.json());
			})
		).then(responses => 
			// responses is an array of all the promise responses
			({ data: responses.map((item) => item.data) }))
	},

	getManyReference: async (resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> => {
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
		const url = `${apiUrl}/${resource}s?${stringify(query)}`;

		const response = await httpClient("GET", url);
		if (!response.headers.has('x-total-count')) {
			throw new Error(
				'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
			);
		}
		return await response.json();
	},

	update: async (resource: string, params: UpdateParams) => {
		const token: string = await getTokenSilently();

		if (resource === 'bellschedule') {
			delete params.data.last_modified;
			delete params.data.creation_date;
		}

		return httpClient("PATCH", `${apiUrl}/${resource}/${params.id}`, token, {
			body: JSON.stringify(params.data),
		}).then((resp) => resp.json())//.then(({ json }) => ({ data: json() }))
	},

	// json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
	updateMany: async (resource: string, params: UpdateManyParams): Promise<UpdateManyResult> =>{
		const token: string = await getTokenSilently();
		return Promise.all(
			params.ids.map(id =>
				httpClient("PATCH", `${apiUrl}/${resource}/${id}`, token, {
					body: JSON.stringify(params.data),
				})
			)
		).then(responses => ({ data: responses.map(response => response.json()) }))
	},

	create: async (resource: string, params: CreateParams): Promise<CreateResult> =>{
		const token: string = await getTokenSilently();

		return httpClient("POST", `${apiUrl}/${resource}`, token, {
			body: JSON.stringify(params.data),
		}).then( response => ({
			data: response.json(),
		}))
	},

	delete: async (resource: string, params: DeleteParams): Promise<DeleteResult> =>{
		const token: string = await getTokenSilently();

		return httpClient("DELETE", `${apiUrl}/${resource}/${params.id}`, token).then(({ json }) => ({ data: json }))
	},

	// json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
	deleteMany: async (resource: string, params: DeleteManyParams): Promise<DeleteManyResult> =>{
		const token: string = await getTokenSilently();

		return Promise.all(
			params.ids.map(id =>
				httpClient("DELETE", `${apiUrl}/${resource}/${id}`, token)
			)
		).then(responses => ({ data: responses.map((response) => response.json()) }))
	},
});