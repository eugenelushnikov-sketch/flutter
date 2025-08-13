<template>
	<div class="space-y-6">
		<h1 class="text-2xl font-semibold">Complex Dashboard</h1>
		<p class="text-neutral-600">Manage your projects and RENT-only units.</p>
	</div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['require-role'], role: 'COMPLEX' })
</script>