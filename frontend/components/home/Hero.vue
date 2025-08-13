<template>
	<section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="rounded-2xl bg-orange-50 p-6 ring-1 ring-black/5">
			<div class="text-2xl font-bold mb-3">Quarterly real estate market report</div>
			<p class="text-neutral-600 mb-4">Fresh analytics, pricing and trends.</p>
			<button class="px-4 py-2 rounded-xl bg-neutral-900 text-white">Read the latest</button>
		</div>
		<NuxtLink to="/" class="rounded-2xl bg-amber-50 p-6 ring-1 ring-black/5 hover:ring-indigo-200 transition">
			<div class="font-semibold">New Builds</div>
			<p class="text-sm text-neutral-600">Browse</p>
		</NuxtLink>
		<div class="grid grid-cols-2 gap-6">
			<NuxtLink to="/" class="rounded-2xl bg-orange-50 p-6 ring-1 ring-black/5 hover:ring-indigo-200 transition">
				<div class="font-semibold">Sale</div>
				<p class="text-sm text-neutral-600">Browse</p>
			</NuxtLink>
			<NuxtLink to="/" class="rounded-2xl bg-orange-50 p-6 ring-1 ring-black/5 hover:ring-indigo-200 transition">
				<div class="font-semibold">Rent</div>
				<p class="text-sm text-neutral-600">Browse</p>
			</NuxtLink>
		</div>
	</section>
</template>