<template>
	<section class="space-y-4">
		<h2 class="text-lg font-semibold">New projects & stages</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<ProjectCard v-for="n in 3" :key="n" :title="`The Light ${n}`" subtitle="Lviv" />
			<div class="grid grid-cols-1 gap-4">
				<ProjectCard v-for="n in 3" :key="`s-${n}`" :title="`Olympia house ${n}`" subtitle="Kyiv" />
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
</script>