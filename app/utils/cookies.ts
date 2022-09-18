import { createCookieSessionStorage } from '@remix-run/node';

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: 'sb-token',
			maxAge: 60 * 60,
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			secure: true,
			secrets: ['super random and', 'securely strong!'],
		},
	});

export { getSession, commitSession, destroySession };
