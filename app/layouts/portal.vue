<template>
  <div class="restomod-shell flex min-h-screen flex-col text-gray-900">
    <AppHeaderCitizen />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooterPortal />
  </div>
</template>
