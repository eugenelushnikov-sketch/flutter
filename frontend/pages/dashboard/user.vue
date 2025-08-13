<template>
	<div class="max-w-6xl mx-auto py-8 space-y-8">
		<h1 class="text-2xl font-bold">User Dashboard</h1>
		<section>
			<h2 class="font-semibold mb-3">My Favorites</h2>
			<ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<li v-for="f in favorites" :key="f.id" class="border rounded-xl p-4">{{ f.unit?.title }}</li>
			</ul>
		</section>
		<section>
			<h2 class="font-semibold mb-3">My Inquiries</h2>
			<div class="rounded-xl border p-4 text-gray-500">Coming soon</div>
		</section>
	</div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const favorites = await $fetch(`${config.public.apiBase}/me/favorites`, { credentials: 'include' });
</script>