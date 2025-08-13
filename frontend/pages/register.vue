<template>
	<div class="max-w-md mx-auto">
		<h1 class="text-2xl font-semibold mb-6">Register</h1>
		<form class="space-y-4" @submit.prevent="submit">
			<input v-model="name" type="text" placeholder="Name" class="w-full border rounded-xl px-4 py-2" />
			<input v-model="email" type="email" placeholder="Email" class="w-full border rounded-xl px-4 py-2" />
			<input v-model="password" type="password" placeholder="Password" class="w-full border rounded-xl px-4 py-2" />
			<button class="w-full bg-neutral-900 text-white rounded-xl py-2">Create account</button>
		</form>
	</div>
</template>
<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const auth = useAuthStore()
async function submit() { await auth.register({ name: name.value, email: email.value, password: password.value }); navigateTo('/dashboard') }
</script>