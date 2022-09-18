import type { ActionFunction } from '@remix-run/node';

import { redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/cookies';

export const action: ActionFunction = async ({ request }) => {
	//get session from headers
	const session = await getSession(request.headers.get('Cookie'));
	//destry session
	const cookieString = await destroySession(session);
	//redirect to '/'
	return redirect('/', {
		headers: {
			'Set-Cookie': cookieString,
		},
	});
};
