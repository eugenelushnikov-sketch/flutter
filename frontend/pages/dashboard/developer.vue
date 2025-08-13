<template>
	<div class="max-w-6xl mx-auto py-8 space-y-6">
		<h1 class="text-2xl font-bold">Developer Dashboard</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<div v-for="n in 3" :key="n" class="border rounded-xl p-4">Project {{ n }}</div>
		</div>
	</div>
</template>