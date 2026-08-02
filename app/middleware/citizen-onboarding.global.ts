export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path.startsWith('/admin') || to.path === '/admin-login') return;

    const publicAuthRoutes = ['/login', '/register', '/forgot-password', '/otp-verification', '/reset-password'];
    const citizen_user = citizenUser();

    if (citizen_user.value === undefined) {
        citizen_user.value = await fetchCitizenCurrentUser();
    }

    if (!citizen_user.value) {
        if (publicAuthRoutes.includes(to.path)) return;
        return navigateTo('/login', { replace: true });
    }

    const requiredRoute = getCustomerOnboardingRoute(citizen_user.value);
    if (!requiredRoute) return;

    if (to.fullPath !== requiredRoute) {
        return navigateTo(requiredRoute, { replace: true });
    }
});
