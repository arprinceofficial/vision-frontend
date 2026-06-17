<template>
  <div class="flex min-h-screen flex-col bg-[#fcfbf9] text-gray-900">
    <AppHeaderCitizen />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooterPortal />
  </div>
</template>
