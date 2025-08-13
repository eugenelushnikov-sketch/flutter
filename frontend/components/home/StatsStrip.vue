<template>
	<section class="rounded-2xl bg-neutral-900 text-white p-6">
		<h2 class="text-lg font-semibold mb-4">Market statistics</h2>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div v-for="city in cities" :key="city.name" class="rounded-xl bg-neutral-800 p-4">
				<div class="text-sm text-neutral-300">{{ city.name }}</div>
				<div class="text-2xl font-bold">{{ city.price }}</div>
				<div class="text-xs text-emerald-400">{{ city.delta }}</div>
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
const cities = [
	{ name: 'Kyiv', price: '46 200', delta: '+0.9%' },
	{ name: 'Lviv', price: '39 100', delta: '+0.6%' },
	{ name: 'Odesa', price: '26 200', delta: '-0.3%' },
	{ name: 'Ivano-Frankivsk', price: '18 300', delta: '+1.2%' },
]
</script>