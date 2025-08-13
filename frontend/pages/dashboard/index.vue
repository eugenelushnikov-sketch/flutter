<script setup lang="ts">
const auth = useAuthStore();
if (!auth.me) {
	navigateTo('/login');
} else {
	const role = auth.me.role;
	switch (role) {
		case 'ADMIN': navigateTo('/dashboard/admin'); break;
		case 'DEVELOPER': navigateTo('/dashboard/developer'); break;
		case 'COMPLEX': navigateTo('/dashboard/complex'); break;
		default: navigateTo('/dashboard/user');
	}
}
</script>