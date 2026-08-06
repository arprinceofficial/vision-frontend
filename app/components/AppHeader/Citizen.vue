<script setup lang="ts">
const isMobileMenuOpen = ref(false)
const openChildMenuLabel = ref<string | null>(null)
const desktopNavRef = ref<HTMLElement | null>(null)
const profileMenuRef = ref<HTMLElement | null>(null)
const isProfileMenuOpen = ref(false)
const route = useRoute()
const { citizen_user, isCitizenLoggedIn, isLoadingLogout, logout } = citizenAuth()
const currentUser = computed(() => getCitizenUserData(citizen_user.value))
const profilePhoto = computed(() => currentUser.value?.user_info?.photo || currentUser.value?.photo || '/assets/images/user-placeholder.svg')
const profileAlt = computed(() => {
    const firstName = currentUser.value?.user_info?.first_name || ''
    const lastName = currentUser.value?.user_info?.last_name || ''
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || 'Profile'
})
const needsOnboarding = computed(() => Boolean(isCitizenLoggedIn.value && getCustomerOnboardingRoute(citizen_user.value)))

type NavLink = {
    label: string
    to?: string
    activePaths?: string[]
    child?: NavLink[]
}

const navLinks: NavLink[] = [
    { label: 'Home', to: '/', activePaths: ['/'] },
    { label: 'My Assets', to: '/my-assets', activePaths: ['/my-assets'] },
    {
        label: 'Our Products',
        activePaths: ['/private-portfolios', '/syndicate-restoration', '/syndicates'],
        child: [
            { label: 'Private Portfolios', to: '/private-portfolios', activePaths: ['/private-portfolios'] },
            { label: 'Syndicated Restoration', to: '/syndicate-restoration', activePaths: ['/syndicate-restoration'] },
            { label: 'Syndicates', to: '/syndicates', activePaths: ['/syndicates'] },
        ]
    },
    { label: 'blog', to: '/blog', activePaths: ['/blog'] },
    { label: 'Retail', to: '/retail', activePaths: ['/retail'] },
    { label: 'Faqs', to: '/faqs', activePaths: ['/faqs'] },
]

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    closeChildMenu()
    closeProfileMenu()
}

const hasChildMenu = (link: NavLink) => Boolean(link.child?.length)

const getMenuId = (link: NavLink) => `${link.label.toLowerCase().replace(/\s+/g, '-')}-menu`

const openChildMenu = (link: NavLink) => {
    if (hasChildMenu(link)) {
        openChildMenuLabel.value = link.label
    }
}

const toggleChildMenu = (link: NavLink) => {
    openChildMenuLabel.value = openChildMenuLabel.value === link.label ? null : link.label
}

const closeChildMenu = () => {
    openChildMenuLabel.value = null
}

const toggleProfileMenu = () => {
    if (!needsOnboarding.value) return
    isProfileMenuOpen.value = !isProfileMenuOpen.value
    closeChildMenu()
}

const closeProfileMenu = () => {
    isProfileMenuOpen.value = false
}

const handleLogout = async () => {
    closeProfileMenu()
    closeMobileMenu()
    await logout()
}

const isActive = (activePaths?: string[]) => Boolean(activePaths?.includes(route.path))

const isLinkActive = (link: NavLink): boolean => {
    return isActive(link.activePaths) || Boolean(link.child?.some((child) => isLinkActive(child)))
}

const handleDocumentClick = (event: MouseEvent) => {
    if (!desktopNavRef.value?.contains(event.target as Node)) {
        closeChildMenu()
    }
    if (!profileMenuRef.value?.contains(event.target as Node)) {
        closeProfileMenu()
    }
}

watch(
    () => route.path,
    () => {
        closeMobileMenu()
        closeProfileMenu()
    }
)

onMounted(() => {
    document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
    <header class="sticky top-0 z-50 border-b border-white/10 bg-tccDeepBlack/80 backdrop-blur-2xl">
        <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="Vision148 home" @click="closeMobileMenu">
                <img src="/logo-4-BrrnFFbn.jpeg" alt="Vision148"
                    class="h-auto w-[100px] transition-transform duration-300 hover:scale-[1.02] sm:w-[40px]">
                <span
                    class="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/80 leading-tight hidden sm:block pl-4">Syndicated<br>Restomod</span>
            </NuxtLink>

            <div ref="desktopNavRef" class="hidden items-center space-x-4 xl:flex 2xl:space-x-6">
                <template v-for="link in navLinks" :key="link.label">
                    <div v-if="hasChildMenu(link)" class="relative" @mouseenter="openChildMenu(link)"
                        @mouseleave="closeChildMenu">
                        <button type="button"
                            class="flex items-center gap-1 font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 hover:text-white focus:outline-none 2xl:text-[11px] 2xl:tracking-[0.18em]"
                            :class="openChildMenuLabel === link.label || isLinkActive(link) ? 'text-tccGold' : 'text-white/70'"
                            :aria-expanded="openChildMenuLabel === link.label" :aria-controls="getMenuId(link)"
                            aria-haspopup="true" @click.stop="toggleChildMenu(link)">
                            {{ link.label }}
                            <svg class="h-3 w-3 transition-transform duration-200"
                                :class="openChildMenuLabel === link.label ? 'rotate-180' : ''" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div v-show="openChildMenuLabel === link.label" :id="getMenuId(link)"
                            class="absolute right-0 top-full z-[100] w-60 pt-4" @click.stop>
                            <div
                                class="overflow-hidden rounded-[1.25rem] border border-tccGold/25 bg-[#050403] py-2 shadow-[0_24px_80px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
                                <NuxtLink v-for="child in link.child" :key="child.label" :to="child.to || '/'"
                                    class="block px-5 py-3 text-xs font-semibold transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
                                    :class="isLinkActive(child) ? 'text-tccGold' : 'text-white/90'"
                                    @click="closeChildMenu">
                                    {{ child.label }}
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                    <NuxtLink v-else :to="link.to || '/'"
                        class="font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 2xl:text-[11px] 2xl:tracking-[0.18em]"
                        :class="isLinkActive(link) ? 'text-tccGold hover:text-white' : 'text-white/70 hover:text-white'">
                        {{ link.label }}
                    </NuxtLink>
                </template>
            </div>

            <div class="hidden items-center space-x-3 xl:flex">
                <div v-if="isCitizenLoggedIn" ref="profileMenuRef" class="relative">
                    <button v-if="needsOnboarding" type="button" class="group relative block"
                        :aria-expanded="isProfileMenuOpen" aria-controls="profile-menu" aria-label="Open profile menu"
                        @click.stop="toggleProfileMenu">
                        <img :src="profilePhoto" :alt="profileAlt"
                            class="h-8 w-8 rounded-full border border-white/30 transition-colors duration-300 group-hover:border-tccGold">
                    </button>
                    <NuxtLink v-else to="/profile" class="group relative block" aria-label="Profile">
                        <img :src="profilePhoto" :alt="profileAlt"
                            class="h-8 w-8 rounded-full border border-white/30 transition-colors duration-300 group-hover:border-tccGold">
                    </NuxtLink>

                    <div v-show="needsOnboarding && isProfileMenuOpen" id="profile-menu"
                        class="absolute right-0 top-full z-[100] w-44 pt-4" @click.stop>
                        <div
                            class="overflow-hidden rounded-[1rem] border border-tccGold/25 bg-[#050403] py-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
                            <button type="button"
                                class="flex w-full items-center gap-3 px-4 py-3 text-left font-poppins text-xs font-semibold uppercase tracking-[0.14em] text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                                :disabled="isLoadingLogout" @click="handleLogout">
                                <i class="pi pi-sign-out text-xs" aria-hidden="true" />
                                <span>{{ isLoadingLogout ? 'Logging Out...' : 'Logout' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <template v-else>
                    <NuxtLink to="/login"
                        class="rounded-full border border-white/20 px-5 py-2.5 font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-tccGold hover:text-tccGold">
                        Login
                    </NuxtLink>
                    <NuxtLink to="/register"
                        class="rounded-full bg-tccGold px-5 py-2.5 font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-tccDarkNavy shadow-md shadow-tccGold/20 transition-all duration-300 hover:bg-tccLightGold">
                        Register
                    </NuxtLink>
                </template>
            </div>

            <button type="button"
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-tccGold xl:hidden"
                :aria-expanded="isMobileMenuOpen" aria-controls="mobile-menu" aria-label="Toggle mobile navigation"
                @click="isMobileMenuOpen = !isMobileMenuOpen">
                <svg v-if="!isMobileMenuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
                <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
            </button>
        </nav>

        <div v-show="isMobileMenuOpen" id="mobile-menu"
            class="border-t border-white/10 bg-tccDeepBlack/95 backdrop-blur-xl xl:hidden">
            <div class="space-y-3 px-4 pb-4 pt-2">
                <template v-for="link in navLinks" :key="`mobile-${link.label}`">
                    <div v-if="hasChildMenu(link)" class="space-y-1">
                        <p class="py-2 font-poppins text-xs font-semibold uppercase tracking-[0.18em]"
                            :class="isLinkActive(link) ? 'text-tccGold' : 'text-white/90'">
                            {{ link.label }}
                        </p>
                        <NuxtLink v-for="child in link.child" :key="`mobile-child-${child.label}`" :to="child.to || '/'"
                            class="block py-2 pl-4 font-poppins text-xs font-semibold uppercase tracking-[0.18em]"
                            :class="isLinkActive(child) ? 'text-tccGold' : 'text-white/75'" @click="closeMobileMenu">
                            {{ child.label }}
                        </NuxtLink>
                    </div>
                    <NuxtLink v-else :to="link.to || '/'"
                        class="block py-2 font-poppins text-xs font-semibold uppercase tracking-[0.18em]"
                        :class="isLinkActive(link) ? 'text-tccGold' : 'text-white/90'" @click="closeMobileMenu">
                        {{ link.label }}
                    </NuxtLink>
                </template>
                <div class="border-t border-white/10 pt-3">
                    <button v-if="isCitizenLoggedIn && needsOnboarding" type="button"
                        class="flex w-full items-center justify-center gap-2 rounded bg-red-500/10 px-4 py-2 text-center font-poppins text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="isLoadingLogout" @click="handleLogout">
                        <i class="pi pi-sign-out text-xs" aria-hidden="true" />
                        {{ isLoadingLogout ? 'Logging Out...' : 'Logout' }}
                    </button>
                    <NuxtLink v-else-if="isCitizenLoggedIn" to="/profile"
                        class="flex w-full items-center justify-center gap-2 rounded bg-tccGold px-4 py-2 text-center font-poppins text-sm font-semibold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                        @click="closeMobileMenu">
                        <img :src="profilePhoto" :alt="profileAlt" class="h-6 w-6 rounded-full">
                        Profile
                    </NuxtLink>
                    <div v-else class="grid grid-cols-2 gap-3">
                        <NuxtLink to="/login"
                            class="block w-full rounded border border-white/20 px-4 py-2 text-center font-poppins text-sm font-semibold text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            @click="closeMobileMenu">
                            Login
                        </NuxtLink>
                        <NuxtLink to="/register"
                            class="block w-full rounded bg-tccGold px-4 py-2 text-center font-poppins text-sm font-semibold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                            @click="closeMobileMenu">
                            Register
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
