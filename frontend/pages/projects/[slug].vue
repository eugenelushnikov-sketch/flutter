<template>
	<div class="max-w-6xl mx-auto py-8 space-y-8" v-if="project">
		<div class="rounded-2xl border p-6">
			<h1 class="text-3xl font-bold">{{ project.name }}</h1>
			<p class="text-gray-600">{{ project.city }} • {{ project.status }}</p>
		</div>
		<section>
			<h2 class="text-xl font-semibold mb-3">Units from developer</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="u in project.units" :key="u.id" class="rounded-xl border p-4">
					<div class="font-medium">{{ u.title }}</div>
					<div class="text-sm text-gray-600">{{ u.listingType }} • {{ u.areaSqm }} m²</div>
					<button class="mt-3 text-indigo-600" @click="inquiry(u.id)">Contact seller</button>
				</div>
			</div>
		</section>
	</div>
</template>
<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const project = await $fetch(`${config.public.apiBase}/projects/${route.params.slug}`);
async function inquiry(unitId: string) {
	try {
		await $fetch(`${config.public.apiBase}/inquiries`, { method: 'POST', body: { unitId }, credentials: 'include' });
		alert('Inquiry sent');
	} catch {
		alert('Login required');
	}
}
</script>