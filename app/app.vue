<script setup>
const app_key = useCookie('app_key', {
  default: () => [],
  watch: true
})
const { setAppKey } = useAppKey()
const cookie = useCookie($XCMS_TOKEN);

const getCmsAuthToken = (response) => response?.data?.token || response?.login?.data?.token;

// ─── SSR-compatible auth: runs BEFORE child useAsyncData calls ─────
await useAsyncData('cms-auth', async () => {
  try {
    const response = await $fetch('/api/auth');
    const token = getCmsAuthToken(response);

    if (!token) {
      throw new Error('CMS auth response did not include a token.');
    }

    cookie.value = token;
    setAppKey(token);
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
