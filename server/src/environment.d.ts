declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			SESSION_SECRET: string;
			DB_PASSWORD: string;
		}
	}
}

export {};
