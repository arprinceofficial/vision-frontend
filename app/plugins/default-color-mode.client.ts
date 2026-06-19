export default defineNuxtPlugin(() => {
  const colorMode = useColorMode();

  // Always start a new application session in dark mode, regardless of a
  // previously stored light/system preference.
  colorMode.preference = 'dark';
});
