<template>
	<section class="space-y-4">
		<h2 class="text-lg font-semibold">Developers</h2>
		<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
			<div v-for="n in 5" :key="n" class="rounded-xl bg-white ring-1 ring-black/5 p-6 text-center">Logo {{ n }}</div>
		</div>
	</section>
</template>