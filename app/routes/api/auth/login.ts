import type { ActionFunction } from '@remix-run/node';

import { redirect } from '@remix-run/node';
import { commitSession, getSession } from '~/utils/cookies';

export const action: ActionFunction = async ({ request }) => {
	// get accessToken
	const formData = await request.formData();
	const { accessToken } = Object.fromEntries(formData);
	//create session
	const session = await getSession();
	//attach accessToken
	session.set('accessToken', accessToken);
	//commit session
	const cookieString = await commitSession(session);
	//return headers to set cookie
	return redirect('/home', {
		headers: {
			'Set-Cookie': cookieString,
		},
	});
};
