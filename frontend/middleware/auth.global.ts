export default defineNuxtRouteMiddleware(async () => {
	if (process.server) return
	const auth = useAuthStore()
	if (auth.me) return
	const config = useRuntimeConfig()
	try {
		const me = await $fetch(`${config.public.apiBase}/auth/me`, { credentials: 'include' })
		if (me) auth.setMe(me as any)
	} catch {}
})