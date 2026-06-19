<script setup lang="ts">
import VaultCard from './VaultCard.vue'

const cards = [
    {
        title: '2007 GP HELMET',
        athlete: 'LEWIS HAMILTON',
        price: '£4,500',
        daysText: '3 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-01.png',
        imageLeft: '-5.36%',
        imageTop: '-0.01%',
        imageWidth: '114.02%',
        imageHeight: '100.01%',
        leftGradientWidth: 860,
        overlayMode: 'solid' as const
    },
    {
        title: 'OLYMPICS RACE SPIKES 2012',
        athlete: 'MO FARAH',
        price: '£6,500',
        daysText: '4 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-02.jpg',
        imageLeft: '-14.24%',
        imageTop: '0%',
        imageWidth: '128.47%',
        imageHeight: '112.69%',
        leftGradientWidth: 938,
        topGradientHeight: 195,
        topGradientOffset: -7,
        overlayMode: 'solid' as const
    },
    {
        title: 'EURO FINAL 2022 GOALKEEPER GLOVES',
        athlete: 'MARY EARPS',
        price: '£2,800',
        daysText: '1 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-03.png',
        imageLeft: '-14.41%',
        imageTop: '-0.01%',
        imageWidth: '136.59%',
        imageHeight: '116.57%',
        leftGradientWidth: 1246,
        topGradientHeight: 390,
        overlayMode: 'solid' as const
    },
    {
        title: 'CHAMPIONSHIP BELT',
        athlete: 'JOHNNY NELSON',
        price: '£6,700',
        daysText: '3 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-04.jpg',
        imageLeft: '-7.37%',
        imageTop: '0%',
        imageWidth: '119.91%',
        imageHeight: '105.18%',
        leftGradientWidth: 860,
        topGradientHeight: 297,
        overlayMode: 'tinted' as const
    },
    {
        title: '2016 TENNIS RACKET',
        athlete: 'ANDY MURRAY',
        price: '£9,000',
        daysText: '9 Hours Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-05.jpg',
        imageLeft: '-22.49%',
        imageTop: '-0.01%',
        imageWidth: '150.6%',
        imageHeight: '132.1%',
        leftGradientWidth: 988,
        topGradientHeight: 302,
        overlayMode: 'tinted' as const
    },
    {
        title: 'RIO 2016 OLYMPIC GOLD MEDAL',
        athlete: 'ADAM PEATY',
        price: '£2,350',
        daysText: '12 Hours Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-06.jpg',
        imageLeft: '-22.49%',
        imageTop: '-0.01%',
        imageWidth: '150.6%',
        imageHeight: '132.1%',
        leftGradientWidth: 988,
        topGradientHeight: 302,
        overlayMode: 'tinted' as const
    },
    {
        title: 'THE ASHES 2010 CRICKET BAT',
        athlete: 'GRAEME SWANN',
        price: '£1,700',
        daysText: '8 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-07.jpg',
        imageLeft: '0%',
        imageTop: '-0.01%',
        imageWidth: '114.62%',
        imageHeight: '100.01%',
        leftGradientWidth: 860,
        topGradientHeight: 383,
        overlayMode: 'solid' as const
    },
    {
        title: '2012 OLYMPICS GOLDS MEDAL',
        athlete: 'JESSICA ENNIS-HILL',
        price: '£3,200',
        daysText: '8 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-08.png',
        imageLeft: '0%',
        imageTop: '-0.01%',
        imageWidth: '114.62%',
        imageHeight: '100.01%',
        leftGradientWidth: 860,
        topGradientHeight: 383,
        overlayMode: 'solid' as const
    },
    {
        title: 'EURO 2020 SEMI-FINAL FOOTBALL BOOTS',
        athlete: 'HARRY KANE',
        price: '£3,800',
        daysText: '8 Days Remaining',
        imageUrl: '/assets/images/citizen/the-vault/card-09.jpg',
        imageLeft: '-12.5%',
        imageTop: '-6.61%',
        imageWidth: '133%',
        imageHeight: '116.66%',
        leftGradientWidth: 860,
        topGradientHeight: 383,
        overlayMode: 'solid' as const
    }
]
</script>

<template>
    <section class="bg-black px-3 pb-6 sm:px-6 sm:pb-8 lg:px-0 lg:pb-[32px]">
        <div class="mx-auto w-full max-w-[1513px]">
            <VaultCard v-for="card in cards" :key="card.title" :title="card.title" :athlete="card.athlete"
                :price="card.price" :days-text="card.daysText" :image-url="card.imageUrl" :image-left="card.imageLeft"
                :image-top="card.imageTop" :image-width="card.imageWidth" :image-height="card.imageHeight"
                :left-gradient-width="card.leftGradientWidth" :top-gradient-height="card.topGradientHeight"
                :top-gradient-offset="card.topGradientOffset" :overlay-mode="card.overlayMode" />
        </div>
    </section>
</template>
