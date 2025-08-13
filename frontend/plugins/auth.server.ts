export default defineNuxtPlugin(async (nuxtApp) => {
	const req = nuxtApp.ssrContext?.event.node.req;
	if (!req) return;
	// If cookies present, try hydrate me
	const hasCookies = !!req.headers.cookie;
	if (!hasCookies) return;
	const config = useRuntimeConfig();
	try {
		const me = await $fetch(`${config.public.apiBase}/auth/me`, {
			credentials: 'include',
			headers: { cookie: req.headers.cookie as string },
		});
		if (me) {
			const auth = useAuthStore();
			auth.setMe(me as any);
		}
	} catch {}
});