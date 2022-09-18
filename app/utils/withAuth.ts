import type {
	ActionFunction,
	DataFunctionArgs,
	LoaderFunction,
} from '@remix-run/node';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { redirect } from '@remix-run/node';
import { getSession } from '~/utils/cookies';
import supabase from '~/utils/supabase';

const withAuth = (
	fn: (
		args: DataFunctionArgs & { user: User; supabaseClient: SupabaseClient }
	) => ReturnType<LoaderFunction> | ReturnType<ActionFunction>
) => {
	return async (context: DataFunctionArgs) => {
		const session = await getSession(context.request.headers.get('Cookie'));
		const accessToken = session.get('accessToken');
		const { user } = await supabase.auth.api.getUser(accessToken);

		if (!user) {
			return redirect('/');
		}

		supabase.auth.setAuth(accessToken);

		return fn({
			...context,
			user,
			supabaseClient: supabase,
		});
	};
};

export default withAuth;
