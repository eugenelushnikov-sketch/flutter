<template>
	<div class="space-y-10">
		<HomeHero />
		<HomeNewsRail />
		<section class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">New builds in the region</h2>
				<NuxtLink to="/" class="text-sm text-neutral-600 hover:text-neutral-900">See all</NuxtLink>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
				<ProjectCard v-for="n in 8" :key="n" :title="`Residential ${n}`" subtitle="Kyiv" badge="New" />
			</div>
		</section>
		<HomeDevelopersRow />
		<StatsStrip />
		<NewProjects />
		<SubscribeStrip />
	</div>
</template>
<script setup lang="ts">
import HomeHero from '~/components/home/Hero.vue'
import HomeNewsRail from '~/components/home/NewsRail.vue'
import HomeDevelopersRow from '~/components/home/DevelopersRow.vue'
import StatsStrip from '~/components/home/StatsStrip.vue'
import NewProjects from '~/components/home/NewProjects.vue'
import SubscribeStrip from '~/components/home/SubscribeStrip.vue'
import ProjectCard from '~/components/cards/ProjectCard.vue'
</script>