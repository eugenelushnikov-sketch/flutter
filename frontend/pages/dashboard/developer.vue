<template>
	<div class="space-y-6">
		<h1 class="text-2xl font-semibold">Developer Dashboard</h1>
		<p class="text-neutral-600">Manage your projects and SALE units.</p>
	</div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['require-role'], role: 'DEVELOPER' })
</script>