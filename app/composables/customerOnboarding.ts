export const getCitizenUserData = (value: any) => {
    if (!value) return null;
    if (value?.data?.uid || value?.data?.id) return value.data;
    if (value?.uid || value?.id) return value;
    if (value?.data?.data?.uid || value?.data?.data?.id) return value.data.data;
    return null;
};

export const isTruthyApiFlag = (value: any) => value === true || value === 1 || value === '1';

export const isCustomerKycComplete = (user: any) => Number(user?.kyc_status) === 1;

export const getCustomerOnboardingRoute = (value: any) => {
    const user = getCitizenUserData(value);
    if (!user) return '/login';
    if (!isTruthyApiFlag(user.is_self_certified)) return '/investor-classification';
    if (!isTruthyApiFlag(user.is_questionnaire_completed)) return '/questionnaire?stage=quiz';
    if (!isCustomerKycComplete(user)) return '/kyc';
    return '';
};
