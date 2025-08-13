import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
	state: () => ({ items: [] as any[] }),
	actions: {
		async load() {
			const config = useRuntimeConfig()
			this.items = await $fetch(`${config.public.apiBase}/me/favorites`, { credentials: 'include' }) as any[]
		},
		async add(unitId: string) {
			const config = useRuntimeConfig()
			await $fetch(`${config.public.apiBase}/favorites/${unitId}`, { method: 'POST', credentials: 'include' })
			await this.load()
		},
		async remove(unitId: string) {
			const config = useRuntimeConfig()
			await $fetch(`${config.public.apiBase}/favorites/${unitId}`, { method: 'DELETE', credentials: 'include' })
			await this.load()
		},
		isFav(unitId: string) { return this.items.some((f:any) => f.unitId === unitId) },
	},
})