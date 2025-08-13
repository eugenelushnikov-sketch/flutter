import { defineStore } from 'pinia'

type Role = 'USER' | 'ADMIN' | 'DEVELOPER' | 'COMPLEX'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		me: null as null | { id: string; email: string; name?: string; role: Role; avatarUrl?: string },
	}),
	actions: {
		setMe(me: any) { this.me = me },
		async login(email: string, password: string) {
			const config = useRuntimeConfig()
			const me = await $fetch(`${config.public.apiBase}/auth/login`, { method: 'POST', body: { email, password }, credentials: 'include' })
			this.me = me as any
			return me
		},
		async register(payload: { email: string; password: string; name?: string }) {
			const config = useRuntimeConfig()
			const me = await $fetch(`${config.public.apiBase}/auth/register`, { method: 'POST', body: payload, credentials: 'include' })
			this.me = me as any
			return me
		},
		async refresh() {
			const config = useRuntimeConfig()
			const me = await $fetch(`${config.public.apiBase}/auth/refresh`, { method: 'POST', credentials: 'include' })
			this.me = me as any
			return me
		},
		async logout() {
			const config = useRuntimeConfig()
			await $fetch(`${config.public.apiBase}/auth/logout`, { method: 'POST', credentials: 'include' })
			this.me = null
		},
	},
})