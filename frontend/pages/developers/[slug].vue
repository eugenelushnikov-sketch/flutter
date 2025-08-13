<template>
	<div v-if="org" class="space-y-8">
		<div class="rounded-2xl border p-6 bg-white shadow-sm">
			<h1 class="text-3xl font-bold">{{ org.name }}</h1>
			<p class="text-neutral-600">{{ org.city }}, {{ org.country }}</p>
		</div>
		<section>
			<h2 class="text-xl font-semibold mb-3">Projects</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				<div v-for="p in org.projects" :key="p.id" class="rounded-xl border p-4 bg-white">
					<NuxtLink :to="`/projects/${p.slug}`" class="font-medium hover:text-indigo-600">{{ p.name }}</NuxtLink>
					<div class="text-sm text-neutral-500">{{ p.city }} • {{ p.status }}</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const org = await $fetch(`${config.public.apiBase}/orgs/${route.params.slug}`)
</script>