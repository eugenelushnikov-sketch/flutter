<template>
	<div class="max-w-6xl mx-auto py-8 space-y-8" v-if="org">
		<div class="rounded-2xl border p-6">
			<h1 class="text-3xl font-bold">{{ org.name }}</h1>
			<p class="text-gray-600">{{ org.city }}, {{ org.country }}</p>
		</div>
		<section>
			<h2 class="text-xl font-semibold mb-3">Projects</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="p in org.projects" :key="p.id" class="rounded-xl border p-4">
					<NuxtLink :to="`/projects/${p.slug}`" class="font-medium">{{ p.name }}</NuxtLink>
					<div class="text-sm text-gray-600">{{ p.city }} • {{ p.status }}</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const org = await $fetch(`${config.public.apiBase}/orgs/${route.params.slug}`);
</script>