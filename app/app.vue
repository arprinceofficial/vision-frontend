<script setup>
const app_key = useCookie('app_key', {
  default: () => [],
  watch: true
})
const { setAppKey } = useAppKey()
const cookie = useCookie($XCMS_TOKEN);
const auth = ref([]);

// ─── SSR-compatible auth: runs BEFORE child useAsyncData calls ─────
await useAsyncData('cms-auth', async () => {
  try {
    const response = await $fetch('/api/auth');
    auth.value = response;
    cookie.value = response.login?.data?.token;
    setAppKey(response.login?.data?.token);
    return response;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
});

const isLoading = ref(false);
watch([cookie, app_key], () => {
  if (cookie.value && app_key.value.length) {
    isLoading.value = true
  }
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
