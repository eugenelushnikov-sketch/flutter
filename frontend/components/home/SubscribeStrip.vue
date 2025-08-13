<template>
	<section class="rounded-2xl bg-white ring-1 ring-black/5 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
		<div>
			<h3 class="font-semibold">Get updates first</h3>
			<p class="text-sm text-neutral-600">Be the first to know about new projects and price changes.</p>
		</div>
		<form class="flex gap-3 w-full md:w-auto" @submit.prevent>
			<input type="email" placeholder="Your email" class="px-4 py-2 rounded-xl border flex-1 md:w-80" />
			<button class="px-4 py-2 rounded-xl bg-neutral-900 text-white">Subscribe</button>
		</form>
	</section>
</template>