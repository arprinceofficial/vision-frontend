<script setup lang="ts">
const products = [
    {
        image: '/generated/home-bg.png',
        alt: 'Syndicated Restoration',
        badge: 'Pillar 01',
        title: 'One-of-One Builds',
        description:
            'Members join rare automotive projects from the earliest stage, following acquisition, teardown, engineering, finishing, and experience access.',
        action: 'Learn More',
        to: 'https://thecarcrowd.uk/syndicate-restoration/',
        disabled: false
    },
    {
        image: '/generated/partner image.png',
        alt: 'Private Portfolio',
        badge: 'Pillar 02',
        title: 'World-Class Partners',
        description:
            'Specialist sourcing, restoration, storage, insurance, and member administration are coordinated through a professional syndicate structure.',
        action: 'Learn More',
        to: 'https://thecarcrowd.uk/private-portfolios/',
        disabled: false
    },
    {
        image: '/generated/experiential.jpeg',
        alt: 'Syndicated Drive',
        badge: 'Pillar 03',
        title: 'Member Experience',
        description:
            'Build updates, private previews, driving access, member votes, and document vaults make ownership feel tangible.',
        action: 'Coming Soon',
        to: '',
        disabled: true
    }
]
</script>

<template>
    <section id="products" class="border-b border-white/10 bg-[#080705] py-20 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto mb-12 max-w-3xl text-center">
                <span class="restomod-eyebrow mx-auto">Why Syndicate</span>
                <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">Built on three
                    pillars.</h2>
                <p class="mt-4 text-sm leading-relaxed text-white/60">A member-first structure for automotive assets
                    that are documented, managed, and experienced together.</p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <article v-for="product in products" :key="product.title"
                    class="restomod-image-card flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                    <div class="relative h-56 overflow-hidden">
                        <img :src="product.image" :alt="product.alt" class="h-full w-full object-cover opacity-90">
                        <span
                            class="absolute left-5 top-5 rounded-full border border-tccGold/30 bg-tccDeepBlack/70 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-tccGold">
                            {{ product.badge }}
                        </span>
                    </div>
                    <div class="flex flex-1 flex-col justify-between p-6">
                        <div>
                            <h3 class="font-poppins text-2xl font-bold leading-tight text-white">{{ product.title }}
                            </h3>
                            <p class="mt-4 text-sm leading-relaxed text-white/60">{{ product.description }}</p>
                        </div>
                        <a v-if="!product.disabled" :href="product.to" target="_blank" rel="noopener noreferrer"
                            class="mt-7 block rounded-full border border-white/20 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:border-tccGold hover:text-tccGold">
                            {{ product.action }}
                        </a>
                        <span v-else
                            class="mt-7 block cursor-not-allowed rounded-full border border-white/10 bg-white/5 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-white/40">
                            {{ product.action }}
                        </span>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
