<template>
	<div class="space-y-12 p-8">
		<section class="bg-gradient-to-r from-indigo-50 to-white rounded-2xl p-10 text-center">
			<h1 class="text-4xl font-bold mb-3">Flatworthy — New Builds, Sale & Rent</h1>
			<p class="text-gray-600 mb-6">Discover projects, units, and developers. Invest confidently.</p>
			<div class="flex flex-wrap justify-center gap-3">
				<NuxtLink to="/" class="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow">New Builds</NuxtLink>
				<NuxtLink to="/" class="px-4 py-2 bg-white border rounded-xl shadow">Sale</NuxtLink>
				<NuxtLink to="/" class="px-4 py-2 bg-white border rounded-xl shadow">Rent</NuxtLink>
			</div>
		</section>
		<section>
			<h2 class="text-xl font-semibold mb-4">New builds in region</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div v-for="n in 6" :key="n" class="rounded-2xl border p-4">Project {{ n }}</div>
			</div>
		</section>
	</div>
</template>