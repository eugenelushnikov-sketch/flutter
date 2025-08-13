export default defineNuxtRouteMiddleware((to) => {
	const auth = useAuthStore();
	const role = auth.me?.role;
	if (!role) return navigateTo('/login');
	const required = (to.meta?.role as string) || '';
	if (required && role !== required) return navigateTo('/');
});