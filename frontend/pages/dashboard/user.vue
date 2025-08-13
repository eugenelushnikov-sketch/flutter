<template>
	<div class="space-y-6">
		<h1 class="text-2xl font-semibold">User Dashboard</h1>
		<section>
			<h2 class="font-medium mb-3">My Favorites</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div v-for="f in favorites" :key="f.id" class="border rounded-xl p-4">
					<div class="font-medium">{{ f.unit?.title }}</div>
					<div class="text-sm text-neutral-500">{{ f.unit?.listingType }} • {{ f.unit?.areaSqm }} m²</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['require-role'], role: 'USER' })
const config = useRuntimeConfig()
const favorites = await $fetch(`${config.public.apiBase}/me/favorites`, { credentials: 'include' })
</script>