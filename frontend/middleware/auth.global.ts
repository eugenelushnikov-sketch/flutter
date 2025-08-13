export default defineNuxtRouteMiddleware(async () => {
	const auth = useAuthStore();
	if (process.server) return;
	if (auth.me) return;
	const config = useRuntimeConfig();
	try {
		const me = await $fetch(`${config.public.apiBase}/auth/me`, { credentials: 'include' });
		if (me) auth.setMe(me as any);
	} catch {}
});