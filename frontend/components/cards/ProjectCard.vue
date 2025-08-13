<template>
	<NuxtLink :to="to" class="group block rounded-2xl overflow-hidden shadow-sm bg-white ring-1 ring-black/5 hover:ring-indigo-200 transition">
		<div class="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-200 relative">
			<img v-if="img" :src="img" alt="" class="absolute inset-0 w-full h-full object-cover" />
			<div class="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-black/70 text-white">{{ badge }}</div>
		</div>
		<div class="p-4">
			<div class="font-medium group-hover:text-indigo-600 line-clamp-1">{{ title }}</div>
			<div class="text-sm text-neutral-500 line-clamp-1">{{ subtitle }}</div>
		</div>
	</NuxtLink>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{ to?: string; img?: string; title: string; subtitle?: string; badge?: string }>(), {
	to: '#',
	badge: '',
})
</script>