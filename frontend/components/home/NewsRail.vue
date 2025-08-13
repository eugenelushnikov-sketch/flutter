<template>
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<h2 class="text-lg font-semibold">Market news</h2>
			<div class="flex gap-2 text-sm">
				<button class="px-3 py-1 rounded-full bg-neutral-100">Newest</button>
				<button class="px-3 py-1 rounded-full bg-neutral-100">Popular</button>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div v-for="n in 8" :key="n" class="rounded-2xl ring-1 ring-black/5 p-4 bg-white">
				<div class="text-sm font-medium line-clamp-2">News headline {{ n }}</div>
				<div class="text-xs text-neutral-500 mt-1">1h ago</div>
			</div>
		</div>
	</section>
</template>