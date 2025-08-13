<template>
	<div class="space-y-8">
		<h1 class="text-2xl font-semibold">Admin Dashboard</h1>
		<section class="space-y-3">
			<h2 class="font-medium">Create Org</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
				<input v-model="org.name" class="border rounded-xl px-3 py-2" placeholder="Name" />
				<input v-model="org.slug" class="border rounded-xl px-3 py-2" placeholder="Slug" />
				<select v-model="org.type" class="border rounded-xl px-3 py-2">
					<option value="DEVELOPER">DEVELOPER</option>
					<option value="COMPLEX">COMPLEX</option>
				</select>
			</div>
			<button class="bg-indigo-600 text-white rounded-xl px-4 py-2" @click="createOrg">Create</button>
		</section>
		<section class="space-y-3">
			<h2 class="font-medium">Create Project</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
				<input v-model="project.name" class="border rounded-xl px-3 py-2" placeholder="Name" />
				<input v-model="project.slug" class="border rounded-xl px-3 py-2" placeholder="Slug" />
				<input v-model="project.orgId" class="border rounded-xl px-3 py-2" placeholder="Org ID" />
			</div>
			<button class="bg-indigo-600 text-white rounded-xl px-4 py-2" @click="createProject">Create</button>
		</section>
		<section class="space-y-3">
			<h2 class="font-medium">Create Unit</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
				<input v-model="unit.projectId" class="border rounded-xl px-3 py-2" placeholder="Project ID" />
				<input v-model="unit.title" class="border rounded-xl px-3 py-2" placeholder="Title" />
				<select v-model="unit.listingType" class="border rounded-xl px-3 py-2">
					<option value="SALE">SALE</option>
					<option value="RENT">RENT</option>
				</select>
			</div>
			<button class="bg-indigo-600 text-white rounded-xl px-4 py-2" @click="createUnit">Create</button>
		</section>
	</div>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['require-role'], role: 'ADMIN' })
const config = useRuntimeConfig()
const org = reactive({ name: '', slug: '', type: 'DEVELOPER' })
const project = reactive({ name: '', slug: '', orgId: '' })
const unit = reactive({ projectId: '', title: '', listingType: 'SALE' })
async function createOrg() { await $fetch(`${config.public.apiBase}/orgs`, { method:'POST', body: org, credentials:'include' }); alert('Org created') }
async function createProject() { await $fetch(`${config.public.apiBase}/projects`, { method:'POST', body: project, credentials:'include' }); alert('Project created') }
async function createUnit() { try { await $fetch(`${config.public.apiBase}/units`, { method:'POST', body: { ...unit, project: { connect: { id: unit.projectId } } }, credentials:'include' }); alert('Unit created') } catch (e:any) { alert(e?.data?.message || 'Error') } }
</script>