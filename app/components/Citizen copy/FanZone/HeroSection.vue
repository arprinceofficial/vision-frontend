<script setup lang="ts">
const heroImage = '/assets/images/citizen/fan-zone/hero-background.png'
</script>

<template>
	<section class="relative h-[62vh] min-h-[520px] w-full overflow-hidden bg-black [font-family:var(--font-family-Body)] sm:h-[72vh] sm:min-h-[620px] lg:h-[985px]">
		<img
			:src="heroImage"
			alt="Fan Zone Hero"
			class="absolute inset-0 h-full w-full object-cover"
		>

		<div class="absolute inset-0 bg-black/30" />
		<div class="absolute inset-0" />

		<div class="relative mx-auto h-full w-full max-w-[1512px] px-4 sm:px-6 lg:px-[63px]">
			<div class="absolute bottom-8 left-4 sm:bottom-10 sm:left-6 lg:bottom-[85px] lg:left-[63px]">
				<p
					class="bg-gradient-to-br from-[#bc9a1d] to-[#d4af37] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(3.5rem,15vw,9.625rem)] uppercase leading-[0.8] text-transparent opacity-90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
				>
					fan zone
				</p>
				<p
					class="max-w-[18ch] [font-family:var(--font-family-Headings)] text-[clamp(1.6rem,6.5vw,4.9375rem)] uppercase leading-[0.82] text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
				>
					find, join and be a part of the community
				</p>
			</div>
		</div>
	</section>
</template>
