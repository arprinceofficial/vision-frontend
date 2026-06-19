<script setup lang="ts">
import VaultCard from '../TheVault/VaultCard.vue'

const cards = [
    {
        title: 'CHAMPIONSHIP BELT',
        athlete: 'JOHNNY NELSON',
        price: '£6,700',
        daysText: '3 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/detail/related-bg-01.png',
        imageLeft: '-7.67%',
        imageTop: '-1.62%',
        imageWidth: '121.46%',
        imageHeight: '104.83%',
        leftGradientWidth: 860,
        overlayMode: 'solid' as const
    },
    {
        title: '2016 TENNIS RACKET',
        athlete: 'ANDY MURRAY',
        price: '£9,000',
        daysText: '9 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/detail/related-bg-02.png',
        imageLeft: '-24.68%',
        imageTop: '-7.76%',
        imageWidth: '129.2%',
        imageHeight: '116.56%',
        leftGradientWidth: 860,
        overlayMode: 'solid' as const
    }
]
</script>

<template>
    <section class="bg-black px-3 pb-8 sm:px-6 lg:px-0 lg:pb-[32px]">
        <div class="mx-auto w-full max-w-[1513px]">
            <h2
                class="py-10 text-center [font-family:var(--font-family-Headings)] text-[clamp(2rem,6.2vw,6.125rem)] leading-[0.8] tracking-[-0.02em] text-white/90 sm:py-14 lg:py-[120px]">
                OTHER ITEMS YOU MIGHT LIKE
            </h2>

            <VaultCard v-for="card in cards" :key="card.title" :title="card.title" :athlete="card.athlete"
                :price="card.price" :days-text="card.daysText" :image-url="card.imageUrl" :image-left="card.imageLeft"
                :image-top="card.imageTop" :image-width="card.imageWidth" :image-height="card.imageHeight"
                :left-gradient-width="card.leftGradientWidth" :overlay-mode="card.overlayMode" />
        </div>
    </section>
</template>
