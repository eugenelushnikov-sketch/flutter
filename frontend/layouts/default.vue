<template>
	<div class="min-h-screen bg-neutral-50 text-neutral-900">
		<header class="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
			<div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				<NuxtLink to="/" class="font-bold text-xl">Flatworthy</NuxtLink>
				<nav class="flex items-center gap-4 text-sm">
					<NuxtLink to="/" class="hover:text-indigo-600">Home</NuxtLink>
					<NuxtLink to="/developers/demo-developer" class="hover:text-indigo-600">Developers</NuxtLink>
					<NuxtLink to="/projects/sunny-hills" class="hover:text-indigo-600">Projects</NuxtLink>
				</nav>
				<div class="flex items-center gap-3">
					<template v-if="auth.me">
						<NuxtLink to="/dashboard" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm">Dashboard</NuxtLink>
						<button @click="logout" class="text-sm text-neutral-600 hover:text-neutral-900">Logout</button>
					</template>
					<template v-else>
						<NuxtLink to="/login" class="text-sm">Login</NuxtLink>
						<NuxtLink to="/register" class="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-sm">Register</NuxtLink>
					</template>
				</div>
			</div>
		</header>
		<main class="max-w-7xl mx-auto px-4 py-8">
			<slot />
		</main>
		<footer class="border-t py-8 text-center text-sm text-neutral-500">© {{ new Date().getFullYear() }} Flatworthy</footer>
	</div>
</template>
<script setup lang="ts">
const auth = useAuthStore();
async function logout() { await auth.logout(); navigateTo('/'); }
</script>