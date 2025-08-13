<template>
	<div v-if="project" class="space-y-8">
		<div class="rounded-2xl border p-6 bg-white shadow-sm">
			<h1 class="text-3xl font-bold">{{ project.name }}</h1>
			<p class="text-neutral-600">{{ project.city }} • {{ project.status }}</p>
		</div>
		<section>
			<h2 class="text-xl font-semibold mb-3">Units from developer</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				<div v-for="u in project.units" :key="u.id" class="rounded-xl border p-4 bg-white">
					<div class="font-medium">{{ u.title }}</div>
					<div class="text-sm text-neutral-500">{{ u.listingType }} • {{ u.areaSqm }} m²</div>
					<div class="flex gap-2 mt-3">
						<FavoriteButton :unit-id="u.id" />
						<button class="text-indigo-600 text-sm" @click="inquiry(u.id)">Contact seller</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const fav = useFavoritesStore(); if (process.client) fav.load()
const project = await $fetch(`${config.public.apiBase}/projects/${route.params.slug}`)
async function inquiry(unitId: string) {
	try { await $fetch(`${config.public.apiBase}/inquiries`, { method: 'POST', body: { unitId }, credentials: 'include' }); alert('Inquiry sent') }
	catch { alert('Login required') }
}
</script>