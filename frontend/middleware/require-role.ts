export default defineNuxtRouteMiddleware((to) => {
	const auth = useAuthStore()
	if (!auth.me) return navigateTo('/login')
	const required = (to.meta?.role as string) || ''
	if (required && auth.me.role !== required) return navigateTo('/')
})