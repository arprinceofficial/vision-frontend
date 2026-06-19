<script setup>
const props = defineProps({
    otpCode: {
        type: String,
        default: '',
    },
    validationsErrors: {
        type: Object,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    resendCountdown: {
        type: Number,
        default: 0,
    },
    otpEmail: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: 'VERIFY YOUR',
    },
    accentTitle: {
        type: String,
        default: 'OTP',
    },
    description: {
        type: String,
        default: 'Enter the 6-digit OTP sent to',
    },
    verifyButtonText: {
        type: String,
        default: 'Verify OTP',
    },
    backButtonText: {
        type: String,
        default: 'Back to Sign Up',
    },
});

const emit = defineEmits(['update:otpCode', 'verify', 'resend', 'back']);

const otpDigits = ref(['', '', '', '', '', '']);
const otpRefs = ref([]);

const syncFromParentCode = (code) => {
    const digits = String(code || '').replace(/\D/g, '').slice(0, 6).split('');
    otpDigits.value = Array.from({ length: 6 }, (_, index) => digits[index] || '');
};

watch(() => props.otpCode, (newCode) => {
    const normalizedCurrent = otpDigits.value.join('');
    const normalizedIncoming = String(newCode || '').replace(/\D/g, '').slice(0, 6);
    if (normalizedCurrent !== normalizedIncoming) {
        syncFromParentCode(normalizedIncoming);
    }
}, { immediate: true });

const emitOtpCode = () => {
    emit('update:otpCode', otpDigits.value.join(''));
};

const setOtpRef = (el, index) => {
    otpRefs.value[index] = el;
};

const focusInput = (index) => {
    nextTick(() => {
        otpRefs.value[index]?.focus();
        otpRefs.value[index]?.select?.();
    });
};

const clearOtpValidation = () => {
    props.validationsErrors.req_otp = '';
};

const handleInput = (index, event) => {
    clearOtpValidation();
    const value = String(event.target.value || '');
    const digits = value.replace(/\D/g, '');

    if (!digits) {
        otpDigits.value[index] = '';
        emitOtpCode();
        return;
    }

    if (digits.length > 1) {
        for (let i = 0; i < digits.length && index + i < 6; i += 1) {
            otpDigits.value[index + i] = digits[i];
        }
        emitOtpCode();
        focusInput(Math.min(index + digits.length, 5));
        return;
    }

    otpDigits.value[index] = digits;
    emitOtpCode();

    if (index < 5) {
        focusInput(index + 1);
    }
};

const handleKeydown = (index, event) => {
    if (event.key === 'Backspace') {
        event.preventDefault();
        clearOtpValidation();

        if (otpDigits.value[index]) {
            otpDigits.value[index] = '';
            emitOtpCode();
            return;
        }

        if (index > 0) {
            otpDigits.value[index - 1] = '';
            emitOtpCode();
            focusInput(index - 1);
        }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < 5) {
        event.preventDefault();
        focusInput(index + 1);
    }
};

const handlePaste = (index, event) => {
    event.preventDefault();
    clearOtpValidation();

    const pasted = String(event.clipboardData?.getData('text') || '');
    const digits = pasted.replace(/\D/g, '').slice(0, 6 - index);

    if (!digits) {
        return;
    }

    for (let i = 0; i < digits.length; i += 1) {
        otpDigits.value[index + i] = digits[i];
    }

    emitOtpCode();
    focusInput(Math.min(index + digits.length, 5));
};
</script>

<template>
    <div class="w-full max-w-[420px] flex flex-col items-center">
        <h2 class="text-center mb-8 sm:mb-10 lg:mb-12 font-bebas-neue text-[clamp(1.85rem,5.8vw,3rem)] leading-[0.88] tracking-[-0.01em]">
            <span style="color: black;">{{ subtitle }} </span>
            <span
                style="background: linear-gradient(165deg, #977b13 0%, #d4af37 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                {{ accentTitle }}
            </span>
        </h2>

        <p class="mb-5 text-center text-sm text-gray-700">
            {{ description }} {{ otpEmail || 'your email' }}
        </p>

        <form @submit.prevent="$emit('verify')" autocomplete="off" novalidate class="w-full flex flex-col gap-3 sm:gap-4">
            <div class="w-full flex items-center justify-center gap-2 sm:gap-3">
                <input v-for="(_, index) in otpDigits" :key="`otp-digit-${index}`" :ref="(el) => setOtpRef(el, index)"
                    :value="otpDigits[index]" type="text" inputmode="numeric" maxlength="1"
                    :autocomplete="index === 0 ? 'one-time-code' : 'off'" autocorrect="off" autocapitalize="off"
                    spellcheck="false"
                    class="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl text-center font-roboto text-lg sm:text-xl lg:text-[24px] outline-none"
                    style="background-color: white; color: black; box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);"
                    @focus="clearOtpValidation" @input="handleInput(index, $event)"
                    @keydown="handleKeydown(index, $event)" @paste="handlePaste(index, $event)" />
            </div>
            <p v-if="validationsErrors.req_otp" class="w-full text-red-500 text-sm px-2 -mt-1">
                {{ validationsErrors.req_otp }}
            </p>

            <div class="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-6">
                <button type="submit" :disabled="isLoading"
                    class="w-full h-11 sm:h-12 rounded-full font-roboto text-lg sm:text-xl lg:text-[24px] flex justify-center items-center cursor-pointer"
                    style="color: black; background: linear-gradient(165deg, #BC9A1D 0%, #D4AF37 100%); box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);">
                    {{ isLoading ? 'Please wait...' : verifyButtonText }}
                </button>

                <button type="button" :disabled="resendCountdown > 0 || isLoading"
                    class="w-full h-11 sm:h-12 rounded-full font-roboto text-base sm:text-lg flex justify-center items-center border border-[#b38f1a] disabled:opacity-60 disabled:cursor-not-allowed"
                    style="color: #111215; background: white;"
                    @click="$emit('resend')">
                    {{ resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP' }}
                </button>

                <button type="button" class="text-sm text-gray-600 text-center hover:underline" @click="$emit('back')">
                    {{ backButtonText }}
                </button>
            </div>
        </form>
    </div>
</template>
