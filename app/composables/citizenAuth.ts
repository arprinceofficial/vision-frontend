const LOGIN = '/v1/customer/login';
const REGISTER = '/v1/customer/register';
const OTP_VERIFY = '/v1/customer/otp-verify';
const OTP_RESEND = '/v1/customer/otp-resend';
const LOGOUT = '/v1/customer/logout';
const CURRENT_USER = '/v1/customer/user';

export const citizenUser = () => {
    return useState('citizen_user', () => undefined);
};

export const citizenAuth = () => {
    const router = useRouter();
    const citizen_user: any = citizenUser();
    const isCitizenLoggedIn = computed(() => !!citizen_user.value);
    const cookie = useCookie($XCTN_TOKEN);
    const isLoadingLogout = ref(false);

    async function login(credentials: any) {
        if (isCitizenLoggedIn.value) return;

        const response: any = await $fetchCitizen(LOGIN, {
            method: 'POST',
            body: credentials
        });
        cookie.value = response.data?.token;
        citizen_user.value = response;
        return response;
    }

    async function register(payload: any) {
        return await $fetchCitizen(REGISTER, {
            method: 'POST',
            body: payload
        });
    }

    async function otpVerify(payload: any) {
        return await $fetchCitizen(OTP_VERIFY, {
            method: 'POST',
            body: payload
        });
    }

    async function otpResend(payload: any) {
        return await $fetchCitizen(OTP_RESEND, {
            method: 'POST',
            body: payload
        });
    }

    async function logout() {
        isLoadingLogout.value = true;
        if (!isCitizenLoggedIn.value) return;
        await $fetchCitizen(LOGOUT, { method: 'POST' });
        citizen_user.value = null;
        cookie.value = null;
        isLoadingLogout.value = false;
        await router.push('/');
    }

    return {
        citizen_user,
        isCitizenLoggedIn,
        isLoadingLogout,
        login,
        register,
        otpVerify,
        otpResend,
        logout,
    };
};

export const fetchCitizenCurrentUser = async () => {
    try {
        return await $fetchCitizen(CURRENT_USER, {
            redirectIfNotAuthenticated: false,
            method: 'POST'
        });
    } catch (error: any) {
        if ([401, 400, 419].includes(error?.response?.status)) return null;
    }
};
