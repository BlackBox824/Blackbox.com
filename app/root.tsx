import { useEffect, useState } from 'react';
import { json } from '@remix-run/node';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useFetcher,
	useLoaderData,
} from '@remix-run/react';
import styles from '~/styles/app.css';
import supabase from '~/utils/supabase';

import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: styles }];
};

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'New Remix App',
	viewport: 'width=device-width,initial-scale=1',
});

export const loader = async () => {
	return json({
		env: {
			SUPABSE_URL: process.env.SUPABSE_URL,
			SUPABSE_ANON_KEY: process.env.SUPABSE_ANON_KEY,
		},
	});
};

export default function App() {
	const { env } = useLoaderData();
	const [user, setUser] = useState<User | null>(null);
	const fetcher = useFetcher();

	useEffect(() => {
		setUser(supabase.auth.user());
		const { data: listner } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);

				if (event === 'SIGNED_IN' && session?.access_token) {
					fetcher.submit(
						{
							accessToken: session.access_token,
						},
						{
							method: 'post',
							action: '/api/auth/login',
						}
					);
				}

				if (event === 'SIGNED_OUT') {
					fetcher.submit(null, {
						method: 'post',
						action: '/api/auth/logout',
					});
				}
			}
		);

		return () => {
			listner?.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<html lang='en'>
			<head>
				<Meta />
				<Links />
			</head>
			<body className='antialiased text-slate-900 bg-slate-50'>
				<Outlet context={{ user }} />
				<ScrollRestoration />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.env = ${JSON.stringify(env)}`,
					}}
				/>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
