import { createClient } from '@supabase/supabase-js';

declare global {
	interface Window {
		env: {
			SUPABSE_URL: string;
			SUPABSE_ANON_KEY: string;
		};
	}
}

const isClient = typeof window !== 'undefined';
const supabaseUrl = isClient
	? window.env.SUPABSE_URL
	: process.env.SUPABSE_URL ?? '';
const supabaseAnonKey = isClient
	? window.env.SUPABSE_ANON_KEY
	: process.env.SUPABSE_ANON_KEY ?? '';

export default createClient(supabaseUrl, supabaseAnonKey, { multiTab: false });
