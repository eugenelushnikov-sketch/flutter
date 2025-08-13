<template>
	<button @click.stop="toggle" class="text-sm px-3 py-1.5 rounded-lg border" :class="is ? 'bg-amber-100 border-amber-300' : 'bg-white'">
		{{ is ? '★ Favorited' : '☆ Favorite' }}
	</button>
</template>
<script setup lang="ts">
const props = defineProps<{ unitId: string }>()
const fav = useFavoritesStore()
const is = computed(() => fav.isFav(props.unitId))
async function toggle() { is.value ? await fav.remove(props.unitId) : await fav.add(props.unitId) }
</script>