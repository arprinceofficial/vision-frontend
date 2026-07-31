export default defineNuxtRouteMiddleware(async () => {
	const citizen_user = citizenUser();
	if (citizen_user.value === undefined) {
		citizen_user.value = await fetchCitizenCurrentUser();
	}
	if (!citizen_user.value) return navigateTo('/login', { replace: true });
});
