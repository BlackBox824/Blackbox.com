import { redirect } from '@remix-run/node';
import { getSession } from '~/utils/cookies';
import supabase from '~/utils/supabase';

export const requireUser = async (request: Request) => {
	const session = await getSession(request.headers.get('Cookie'));
	const accessToken = session.get('accessToken') as string;
	const { user } = await supabase.auth.api.getUser(accessToken);

	if (!user) {
		throw redirect('/', {
			status: 308,
		});
	}

	supabase.auth.setAuth(accessToken);

	return {
		user,
		supabaseClient: supabase,
	};
};
