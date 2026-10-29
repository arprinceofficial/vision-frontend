<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const isFullscreen = ref(false);
const activeTab = ref('visual'); // 'visual' | 'code' | 'preview'
const previewViewport = ref('desktop'); // 'desktop' | 'mobile'
const useSampleData = ref(true);
const copiedTag = ref('');
const copiedHtml = ref(false);
const autoSlug = ref(true);

const formData = ref({
    id: null,
    name: '',
    slug: '',
    email_subject: '',
    email_body: '',
    status: 0,
});
const isChecked = ref(false);
const quillInstance = ref(null);

// Preset variables catalog
const variableCategories = [
    {
        name: 'Recipient / User',
        variables: [
            { key: 'first_name', label: 'First Name', example: 'Alex' },
            { key: 'last_name', label: 'Last Name', example: 'Morgan' },
            { key: 'name', label: 'Full Name', example: 'Alex Morgan' },
            { key: 'email', label: 'Email Address', example: 'alex.morgan@example.com' },
            { key: 'phone', label: 'Phone Number', example: '+1 (555) 234-5678' },
        ]
    },
    {
        name: 'Security & Auth',
        variables: [
            { key: 'otp', label: 'One-Time Password', example: '849201' },
        ]
    },
    {
        name: 'Vision148 Vault & System',
        variables: [
            { key: 'domain_title', label: 'Company / Brand', example: 'Vision148' },
            { key: 'app_url', label: 'Vault URL', example: 'https://vision148.com' },
        ]
    },
    {
        name: 'Inquiries & Forms',
        variables: [
            { key: 'message', label: 'Submission Message', example: 'Interested in the 1967 Shelby GT500 syndicate investment.' },
        ]
    }
];

// Sample data matching Vision148 Vault specifications
const sampleData = ref({
    first_name: 'Alex',
    last_name: 'Morgan',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    otp: '849201',
    domain_title: 'Vision148',
    app_url: 'https://vision148.com',
    message: 'Hello, I would like to learn more about allocating capital into the 1967 Shelby GT500 collectible asset syndicate. Please connect me with private client relations.',
});

// Detect all variables present in current template
const detectedVariables = computed(() => {
    const combined = `${formData.value.email_subject || ''} ${formData.value.email_body || ''}`;
    const matches = combined.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g) || [];
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
});

// Word and character counts
const templateStats = computed(() => {
    const html = formData.value.email_body || '';
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    return { words, chars };
});

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const onNameChange = () => {
    if (props.modalTitle === 'Create' && autoSlug.value) {
        formData.value.slug = generateSlug(formData.value.name);
    }
};

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            name: value.name || '',
            slug: value.slug || '',
            email_subject: value.email_subject || '',
            email_body: value.email_body || '',
            status: value.status ?? 0,
        };
        isChecked.value = value.status == 1;
        autoSlug.value = false;
    } else {
        formData.value = {
            id: null,
            name: '',
            slug: '',
            email_subject: 'Inquiry Confirmation | Vision148',
            email_body: `<h1 style="color: #D4AF37; font-size: 26px; font-weight: 700; margin-bottom: 20px;">Welcome to Vision148</h1>
<p style="color: #a0a0a0; font-size: 15px; line-height: 1.7;">Dear {{first_name}} {{last_name}},</p>
<p style="color: #a0a0a0; font-size: 15px; line-height: 1.7;">Thank you for your interest in our rare and historical automotive syndicates.</p>
<div style="text-align: center; margin: 30px 0;">
  <a href="{{app_url}}" style="display: inline-block; padding: 14px 36px; background: linear-gradient(165deg, #BC9A1D 0%, #D4AF37 100%); color: #000000 !important; text-decoration: none; font-weight: 700; border-radius: 50px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px;">Enter Member Vault</a>
</div>`,
            status: 1,
        };
        isChecked.value = true;
        autoSlug.value = true;
    }
}, { immediate: true });

const handleCheckboxChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
};

// Quill editor load handler
const onEditorLoad = ({ instance }) => {
    quillInstance.value = instance;
};

// Insert variable tag into editor or subject
const insertTagToBody = (tagKey) => {
    const tag = `{{${tagKey}}}`;
    if (activeTab.value === 'code') {
        formData.value.email_body = (formData.value.email_body || '') + tag;
    } else if (quillInstance.value) {
        const range = quillInstance.value.getSelection(true) || { index: quillInstance.value.getLength() - 1 };
        quillInstance.value.insertText(range.index, tag);
        quillInstance.value.setSelection(range.index + tag.length);
    } else {
        formData.value.email_body = (formData.value.email_body || '') + tag;
    }
    copyTagFeedback(tagKey);
};

const insertTagToSubject = (tagKey) => {
    const tag = `{{${tagKey}}}`;
    formData.value.email_subject = (formData.value.email_subject || '') + ' ' + tag;
    copyTagFeedback(tagKey);
};

const copyTagFeedback = (tagKey) => {
    copiedTag.value = tagKey;
    if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(`{{${tagKey}}}`);
    }
    setTimeout(() => {
        if (copiedTag.value === tagKey) {
            copiedTag.value = '';
        }
    }, 2000);
};

// Insert Vision148 Vault styled snippets (matching payment.blade.php & email_template_vision148.blade.php)
const insertSnippet = (snippetType) => {
    let snippetHtml = '';
    switch (snippetType) {
        case 'gold_btn':
            snippetHtml = `<div style="text-align: center; margin: 35px 0;">
  <a href="{{app_url}}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(165deg, #BC9A1D 0%, #D4AF37 100%); color: #000000 !important; text-decoration: none; font-weight: 700; border-radius: 50px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4); font-family: 'Inter', -apple-system, sans-serif;">Access Private Vault &rarr;</a>
</div>`;
            break;
        case 'status_banner':
            snippetHtml = `<div style="background: linear-gradient(165deg, #BC9A1D 0%, #D4AF37 100%); padding: 6px 12px; text-align: center; border-radius: 6px; margin: 20px 0;">
  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; font-weight: 800; color: #000000;">Payment &bull; Secured Vault Confirmation</span>
</div>`;
            break;
        case 'vault_card':
            snippetHtml = `<div style="background-color: #141414; border-radius: 12px; padding: 25px; margin: 24px 0; border: 1px solid #222222;">
  <h3 style="color: #D4AF37; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #222; padding-bottom: 10px;">Private Syndicate Details</h3>
  <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">Your syndicate allocation request has been received and verified by our acquisition committee.</p>
  <p style="color: #ffffff; font-size: 14px; margin: 0;"><strong>Status:</strong> <span style="color: #D4AF37;">Allocation Reserved</span></p>
</div>`;
            break;
        case 'gold_otp':
            snippetHtml = `<div style="background: #0c0c0c; border: 1px solid #BC9A1D; border-radius: 14px; padding: 24px; text-align: center; margin: 28px 0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.15);">
  <div style="font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2.5px; font-weight: 600; margin-bottom: 10px;">One-Time Security Passcode</div>
  <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #D4AF37; font-family: monospace; text-shadow: 0 0 15px rgba(212, 175, 55, 0.35);">{{otp}}</div>
  <div style="font-size: 12px; color: #71717a; margin-top: 10px;">Valid for 15 minutes. Never disclose this code.</div>
</div>`;
            break;
        case 'sender_table':
            snippetHtml = `<div style="background-color: #141414; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #222222;">
  <h3 style="color: #D4AF37; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #222; padding-bottom: 10px;">Inquiry &amp; Client Information</h3>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr style="border-bottom: 1px solid #1a1a1a;">
      <td style="padding: 10px 0; font-weight: 600; color: #71717a; width: 30%;">Full Name</td>
      <td style="padding: 10px 0; color: #ffffff;">{{first_name}} {{last_name}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #1a1a1a;">
      <td style="padding: 10px 0; font-weight: 600; color: #71717a;">Email</td>
      <td style="padding: 10px 0; color: #D4AF37;">{{email}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #1a1a1a;">
      <td style="padding: 10px 0; font-weight: 600; color: #71717a;">Phone</td>
      <td style="padding: 10px 0; color: #ffffff;">{{phone}}</td>
    </tr>
    <tr>
      <td style="padding: 12px 0 0 0; font-weight: 600; color: #71717a; vertical-align: top;">Message</td>
      <td style="padding: 12px 0 0 0; color: #e4e4e7; line-height: 1.6;">{{message}}</td>
    </tr>
  </table>
</div>`;
            break;
        case 'vault_footer':
            snippetHtml = `<div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #1a1a1a; text-align: center; font-size: 12px; color: #555555;">
  <p style="margin: 0 0 10px 0; color: #888888;">&copy; Vision148. Secured Investment Vault.</p>
  <p style="margin: 0; font-size: 11px;">You are receiving this communication as a verified participant of Vision148 Syndicate Platform.</p>
</div>`;
            break;
        case 'divider':
            snippetHtml = `<hr style="border: none; border-top: 1px solid #222222; margin: 28px 0;" />`;
            break;
    }

    if (activeTab.value === 'code') {
        formData.value.email_body = (formData.value.email_body || '') + '\n' + snippetHtml;
    } else if (quillInstance.value) {
        const range = quillInstance.value.getSelection(true) || { index: quillInstance.value.getLength() - 1 };
        quillInstance.value.clipboard.dangerouslyPasteHTML(range.index, snippetHtml);
    } else {
        formData.value.email_body = (formData.value.email_body || '') + '\n' + snippetHtml;
    }
};

// Copy HTML code to clipboard
const copyHtmlCode = () => {
    if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(formData.value.email_body || '');
        copiedHtml.value = true;
        setTimeout(() => {
            copiedHtml.value = false;
        }, 2000);
    }
};

// Beautify HTML indentation
const beautifyHtml = () => {
    let html = formData.value.email_body || '';
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    html = html.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    html.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }
        let padding = '';
        for (let i = 0; i < pad; i++) {
            padding += '  ';
        }
        formatted += padding + node + '\r\n';
        pad += indent;
    });
    formData.value.email_body = formatted.trim();
};

// Preview replacements
const replaceMergeTags = (content) => {
    if (!content) return '';
    if (!useSampleData.value) return content;

    let res = content;
    for (const [key, val] of Object.entries(sampleData.value)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        res = res.replace(regex, val);
    }
    return res;
};

const renderedPreviewSubject = computed(() => {
    return replaceMergeTags(formData.value.email_subject || '(No Subject)');
});

const renderedPreviewBody = computed(() => {
    return replaceMergeTags(formData.value.email_body || '<p style="color:#71717a; font-style:italic;">Template body is empty.</p>');
});

// Validation and Save
const validations_errors = ref({});
const skip_validations = ref(['id', 'status']);
const isLoading = ref(false);
const response_modal = ref({});

const validateForm = () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(
        item => !formData.value[item] && !skip_validations.value.includes(item)
    );
    if (errors.length > 0) {
        errors.forEach(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return false;
    }
    return true;
};

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/email-templates/${props.item.id}`, {
            method: 'PUT',
            body: formData.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        console.error('Update Template Error', e);
        if (e.response?.status === 404 || e.response?.status === 422 || e.response?.status === 409) {
            const errs = e.response._data?.data;
            if (errs) {
                for (const key in errs) {
                    if (Object.prototype.hasOwnProperty.call(errs, key)) {
                        validations_errors.value[key] = errs[key][0];
                    }
                }
            }
        } else {
            response_modal.value = {
                status: false,
                message: e.response?._data?.message || 'Something went wrong. Please try again later.',
            };
        }
    } finally {
        isLoading.value = false;
    }
};

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/email-templates`, {
            method: 'POST',
            body: formData.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        console.error('Create Template Error', e);
        if (e.response?.status === 404 || e.response?.status === 422 || e.response?.status === 409) {
            const errs = e.response._data?.data;
            if (errs) {
                for (const key in errs) {
                    if (Object.prototype.hasOwnProperty.call(errs, key)) {
                        validations_errors.value[key] = errs[key][0];
                    }
                }
            }
        } else {
            response_modal.value = {
                status: false,
                message: e.response?._data?.message || 'Something went wrong. Please try again later.',
            };
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false"
        class="vault-dialog-theme"
        :style="isFullscreen ? { width: '100vw', height: '100vh', maxWidth: '100vw', margin: 0, borderRadius: 0 } : { width: '95vw', maxWidth: '1440px' }"
        :contentStyle="isFullscreen ? { height: 'calc(100vh - 140px)', padding: '1.25rem', backgroundColor: '#050505' } : { maxHeight: '82vh', padding: '1.25rem', backgroundColor: '#050505' }"
        @update:visible="$emit('close')">

        <!-- Custom Header with Vision148 Vault & Gold Branding -->
        <template #header>
            <div class="flex items-center justify-between w-full border-b border-[#1a1a1a] pb-3 bg-[#050505] px-2">
                <div class="flex items-center gap-3.5">
                    <!-- Brand Gold Vault Emblem -->
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BC9A1D] to-[#D4AF37] flex items-center justify-center text-black font-bold shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]">
                        <i class="pi pi-envelope text-lg text-black"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2.5">
                            <h3 class="text-xl font-bold text-white tracking-wide">
                                {{ modalTitle }} Email Template
                            </h3>
                            <span v-if="formData.slug" class="px-2.5 py-0.5 text-xs font-mono rounded-full bg-[#0c0c0c] text-[#D4AF37] border border-[#BC9A1D]/40">
                                {{ formData.slug }}
                            </span>
                        </div>
                        <p class="text-xs text-[#a0a0a0] mt-0.5">
                            Vision148 Vault luxury template builder with gold accents, dynamic merge tags & live client preview.
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Status toggle styled with gold -->
                    <div class="flex items-center gap-2 bg-[#0c0c0c] px-3 py-1.5 rounded-lg border border-[#1a1a1a]">
                        <span class="text-xs font-semibold tracking-wider uppercase text-[11px]" :class="isChecked ? 'text-[#D4AF37]' : 'text-[#71717a]'">
                            {{ isChecked ? 'Active' : 'Draft' }}
                        </span>
                        <ToggleSwitch v-model="isChecked" @change="handleCheckboxChange" class="gold-switch" />
                    </div>

                    <!-- Fullscreen toggle -->
                    <button type="button" @click="isFullscreen = !isFullscreen"
                        class="p-2 rounded-lg text-[#a0a0a0] hover:text-[#D4AF37] hover:bg-[#0c0c0c] border border-transparent hover:border-[#1a1a1a] transition"
                        :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
                        <i :class="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"></i>
                    </button>

                    <!-- Close button -->
                    <button type="button" @click="$emit('close')"
                        class="p-2 rounded-lg text-[#71717a] hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/40 transition"
                        title="Close">
                        <i class="pi pi-times text-lg"></i>
                    </button>
                </div>
            </div>
        </template>

        <!-- Main Workspace -->
        <div class="flex flex-col gap-4 h-full bg-[#050505]">

            <!-- Top Configuration Grid (Name, Slug, Subject) - Vault Card Style -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-4 bg-[#0c0c0c] rounded-2xl border border-[#1a1a1a] shadow-xl">
                <!-- Template Name -->
                <div class="md:col-span-4">
                    <label class="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1.5">
                        Template Name <span class="text-red-400">*</span>
                    </label>
                    <LazyInputText v-model="formData.name" @input="onNameChange"
                        class="w-full text-sm bg-[#141414] text-white border-[#222222] focus:border-[#D4AF37]"
                        placeholder="e.g. Contact Form Admin Notification"
                        :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.name = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.name" />
                </div>

                <!-- Slug -->
                <div class="md:col-span-3">
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                            Identifier Slug <span class="text-red-400">*</span>
                        </label>
                        <button v-if="modalTitle === 'Create'" type="button"
                            @click="autoSlug = !autoSlug; if(autoSlug) formData.slug = generateSlug(formData.name)"
                            class="text-[10px] text-[#D4AF37] hover:underline uppercase tracking-wider">
                            {{ autoSlug ? 'Auto' : 'Manual' }}
                        </button>
                    </div>
                    <LazyInputText v-model="formData.slug"
                        class="w-full text-sm font-mono bg-[#141414] text-white border-[#222222] focus:border-[#D4AF37]"
                        placeholder="e.g. contact-form-admin"
                        :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.slug = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.slug" />
                </div>

                <!-- Email Subject Line -->
                <div class="md:col-span-5">
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                            Email Subject Line <span class="text-red-400">*</span>
                        </label>
                        <span class="text-[11px] text-[#71717a]">Supports merge tags</span>
                    </div>
                    <div class="relative flex items-center">
                        <LazyInputText v-model="formData.email_subject"
                            class="w-full text-sm pr-16 bg-[#141414] text-white border-[#222222] focus:border-[#D4AF37]"
                            placeholder="e.g. New Inquiry Received | {{domain_title}}"
                            :class="validations_errors.email_subject ? 'border-[#f44336!important]' : ''" autocomplete="off"
                            @focus="validations_errors.email_subject = ''" />
                        <div class="absolute right-1 flex items-center">
                            <button type="button" @click="insertTagToSubject('first_name')" title="Insert {{first_name}} tag"
                                class="px-2 py-0.5 text-[10px] bg-[#1a1a1a] text-[#D4AF37] border border-[#BC9A1D]/50 rounded font-mono hover:bg-[#BC9A1D] hover:text-black transition">
                                +Name
                            </button>
                        </div>
                    </div>
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.email_subject" />
                </div>
            </div>

            <!-- Builder Area: Left Canvas (Visual/Code/Preview) + Right Vault Tools Panel -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[460px]">

                <!-- Left Section: Main Workspace Canvas -->
                <div class="lg:col-span-9 flex flex-col rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] overflow-hidden shadow-2xl">

                    <!-- Workspace Action Bar -->
                    <div class="flex flex-wrap items-center justify-between p-2.5 bg-[#080808] border-b border-[#1a1a1a] gap-2">
                        <!-- Mode Tabs (Visual, HTML, Preview) -->
                        <div class="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#1e1e1e]">
                            <button type="button" @click="activeTab = 'visual'"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition"
                                :class="activeTab === 'visual' ? 'bg-gradient-to-r from-[#BC9A1D] to-[#D4AF37] text-black shadow-md' : 'text-[#a0a0a0] hover:text-white'">
                                <i class="pi pi-file-edit"></i>
                                <span>Visual Editor</span>
                            </button>

                            <button type="button" @click="activeTab = 'code'"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition"
                                :class="activeTab === 'code' ? 'bg-gradient-to-r from-[#BC9A1D] to-[#D4AF37] text-black shadow-md' : 'text-[#a0a0a0] hover:text-white'">
                                <i class="pi pi-code"></i>
                                <span>HTML Source</span>
                            </button>

                            <button type="button" @click="activeTab = 'preview'"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition"
                                :class="activeTab === 'preview' ? 'bg-gradient-to-r from-[#BC9A1D] to-[#D4AF37] text-black shadow-md' : 'text-[#a0a0a0] hover:text-white'">
                                <i class="pi pi-eye"></i>
                                <span>Live Preview</span>
                            </button>
                        </div>

                        <!-- Secondary Tab Controls -->
                        <div class="flex items-center gap-2">
                            <!-- In Preview Mode: Viewport Switcher & Sample Data Toggle -->
                            <template v-if="activeTab === 'preview'">
                                <div class="flex items-center gap-1 bg-[#141414] p-0.5 rounded-lg border border-[#1e1e1e] text-xs">
                                    <button type="button" @click="previewViewport = 'desktop'"
                                        class="px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium"
                                        :class="previewViewport === 'desktop' ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-[#71717a] hover:text-white'">
                                        <i class="pi pi-desktop text-xs"></i>
                                        <span>Desktop</span>
                                    </button>
                                    <button type="button" @click="previewViewport = 'mobile'"
                                        class="px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium"
                                        :class="previewViewport === 'mobile' ? 'bg-[#D4AF37] text-black shadow-xs' : 'text-[#71717a] hover:text-white'">
                                        <i class="pi pi-mobile text-xs"></i>
                                        <span>Mobile</span>
                                    </button>
                                </div>

                                <div class="flex items-center gap-1.5 text-xs text-[#a0a0a0]">
                                    <ToggleSwitch v-model="useSampleData" class="gold-switch" />
                                    <span>Sample Data</span>
                                </div>
                            </template>

                            <!-- In Code Mode: Format & Copy buttons -->
                            <template v-else-if="activeTab === 'code'">
                                <button type="button" @click="beautifyHtml"
                                    class="px-2.5 py-1 text-xs bg-[#141414] text-[#a0a0a0] border border-[#222] rounded hover:text-white hover:border-[#D4AF37] flex items-center gap-1 transition">
                                    <i class="pi pi-align-left text-xs"></i>
                                    <span>Format HTML</span>
                                </button>
                                <button type="button" @click="copyHtmlCode"
                                    class="px-2.5 py-1 text-xs bg-[#141414] text-[#D4AF37] border border-[#BC9A1D]/40 rounded hover:bg-[#D4AF37] hover:text-black flex items-center gap-1 transition">
                                    <i :class="copiedHtml ? 'pi pi-check text-black' : 'pi pi-copy'"></i>
                                    <span>{{ copiedHtml ? 'Copied!' : 'Copy Code' }}</span>
                                </button>
                            </template>

                            <!-- In Visual Mode: Quick Vault Block Inserters -->
                            <template v-else>
                                <div class="hidden sm:flex items-center gap-1.5 text-xs">
                                    <span class="text-[10px] uppercase font-bold tracking-wider text-[#71717a] mr-1">Insert Vault Block:</span>
                                    <button type="button" @click="insertSnippet('gold_btn')"
                                        class="px-2 py-0.5 rounded bg-[#141414] text-[#D4AF37] border border-[#BC9A1D]/40 hover:bg-[#D4AF37] hover:text-black transition">
                                        + Gold CTA
                                    </button>
                                    <button type="button" @click="insertSnippet('gold_otp')"
                                        class="px-2 py-0.5 rounded bg-[#141414] text-[#D4AF37] border border-[#BC9A1D]/40 hover:bg-[#D4AF37] hover:text-black transition">
                                        + Gold OTP
                                    </button>
                                    <button type="button" @click="insertSnippet('vault_card')"
                                        class="px-2 py-0.5 rounded bg-[#141414] text-[#e4e4e7] border border-[#222] hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
                                        + Vault Card
                                    </button>
                                    <button type="button" @click="insertSnippet('sender_table')"
                                        class="px-2 py-0.5 rounded bg-[#141414] text-[#e4e4e7] border border-[#222] hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
                                        + Info Table
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Canvas Body -->
                    <div class="flex-1 p-3.5 overflow-y-auto bg-[#0a0a0a]">
                        <!-- 1. Visual WYSIWYG Mode -->
                        <div v-show="activeTab === 'visual'" class="h-full flex flex-col">
                            <Editor v-model="formData.email_body"
                                @load="onEditorLoad"
                                editorStyle="min-height: 400px; max-height: calc(100vh - 350px); font-size: 15px; line-height: 1.7;"
                                class="w-full flex-1 vault-quill-editor"
                                placeholder="Compose email template here or click dynamic tags..."
                                :class="validations_errors.email_body ? 'border-[#f44336!important]' : ''" />
                            <LazyInputError class="text-xs mt-1" :message="validations_errors.email_body" />
                        </div>

                        <!-- 2. HTML Source Code Mode -->
                        <div v-show="activeTab === 'code'" class="h-full flex flex-col">
                            <div class="flex items-center justify-between text-xs text-[#71717a] mb-2 font-mono">
                                <span>HTML source code editor (synchronizes with Visual and Preview modes)</span>
                                <span>{{ templateStats.chars }} characters</span>
                            </div>
                            <textarea v-model="formData.email_body"
                                class="w-full flex-1 p-4 font-mono text-xs sm:text-sm bg-[#050505] text-[#D4AF37] rounded-xl border border-[#222222] focus:outline-none focus:border-[#D4AF37] transition leading-relaxed min-h-[400px]"
                                rows="18"
                                placeholder="Paste or type raw HTML email template code here..."
                                spellcheck="false"
                                @focus="validations_errors.email_body = ''"></textarea>
                            <LazyInputError class="text-xs mt-1" :message="validations_errors.email_body" />
                        </div>

                        <!-- 3. Live Client Preview Mode (Vision148 Brand Container) -->
                        <div v-show="activeTab === 'preview'" class="h-full flex flex-col items-center bg-[#050505] p-4 rounded-xl overflow-y-auto">
                            <!-- Simulated Email Client Window -->
                            <div class="w-full transition-all duration-300"
                                :class="previewViewport === 'mobile' ? 'max-w-[390px] border-[6px] border-[#1a1a1a] rounded-[36px] shadow-2xl p-2 bg-[#050505]' : 'max-w-[650px] shadow-2xl rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c]'">

                                <!-- Simulated Mail App Header -->
                                <div class="border-b border-[#1a1a1a] p-4 bg-[#111111] rounded-t-xl">
                                    <div class="flex items-center justify-between text-xs text-[#71717a] mb-2">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                                        </div>
                                        <span class="text-[11px] text-[#D4AF37] font-mono tracking-wider">Vision148 Secured Vault</span>
                                    </div>
                                    <div class="space-y-1.5 text-xs">
                                        <div class="flex items-center gap-2">
                                            <span class="font-semibold text-[#71717a] w-14">From:</span>
                                            <span class="text-white font-medium">Vision148 Notification &lt;noreply@vision148.com&gt;</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="font-semibold text-[#71717a] w-14">To:</span>
                                            <span class="text-[#e4e4e7]">{{ sampleData.email }}</span>
                                        </div>
                                        <div class="flex items-start gap-2 pt-1.5 border-t border-[#1e1e1e] mt-1.5">
                                            <span class="font-semibold text-[#71717a] w-14">Subject:</span>
                                            <span class="font-bold text-[#D4AF37] text-sm">{{ renderedPreviewSubject }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Vision148 Luxury Email Container Wrapper (matching email_template_vision148.blade.php) -->
                                <div class="p-6 bg-[#0c0c0c] text-white min-h-[380px] rounded-b-xl overflow-x-auto vault-preview-rendered">
                                    <!-- Vision148 Brand Header inside preview -->
                                    <div class="pb-6 mb-6 text-center border-b border-[#1a1a1a]">
                                        <div class="inline-flex items-center gap-2.5">
                                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BC9A1D] to-[#D4AF37] flex items-center justify-center font-bold text-black text-sm">
                                                V
                                            </div>
                                            <span class="text-sm font-semibold tracking-[0.25em] uppercase text-white">
                                                Vision148
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Rendered Dynamic Content -->
                                    <div v-html="renderedPreviewBody"></div>

                                    <!-- Vision148 Brand Footer inside preview -->
                                    <div class="mt-8 pt-6 border-t border-[#1a1a1a] text-center text-xs text-[#555555]">
                                        <p class="m-0 mb-1">&copy; {{ new Date().getFullYear() }} Vision148. All rights reserved.</p>
                                        <p class="m-0 text-[11px] text-[#444444]">Automated communication from Vision148 Secured Vault.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Section: Merge Tags & Vault Block Inserters -->
                <div class="lg:col-span-3 flex flex-col gap-3.5 overflow-y-auto">

                    <!-- Merge Tags Catalog -->
                    <div class="p-4 bg-[#0c0c0c] rounded-2xl border border-[#1a1a1a] shadow-xl">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                                <i class="pi pi-tags text-[#D4AF37]"></i>
                                <span>Dynamic Tags</span>
                            </h4>
                            <span class="text-[10px] text-[#71717a]">1-Click Insert</span>
                        </div>
                        <p class="text-[11px] text-[#a0a0a0] mb-3 leading-relaxed">
                            Click any merge tag below to insert it at cursor position:
                        </p>

                        <div class="space-y-3.5">
                            <div v-for="category in variableCategories" :key="category.name">
                                <span class="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block mb-1.5">
                                    {{ category.name }}
                                </span>
                                <div class="flex flex-wrap gap-1.5">
                                    <button v-for="v in category.variables" :key="v.key"
                                        type="button"
                                        @click="insertTagToBody(v.key)"
                                        class="group relative inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#141414] border border-[#222222] text-xs font-mono text-[#e4e4e7] hover:border-[#D4AF37] hover:text-[#D4AF37] transition shadow-xs">
                                        <span>&#123;&#123;{{ v.key }}&#125;&#125;</span>
                                        <span v-if="copiedTag === v.key" class="text-[10px] text-[#D4AF37] font-sans font-bold">
                                            &check;
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Detected Tags in Current Template -->
                        <div v-if="detectedVariables.length > 0" class="mt-4 pt-3.5 border-t border-[#1a1a1a]">
                            <span class="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider block mb-1.5">
                                Active in Template ({{ detectedVariables.length }})
                            </span>
                            <div class="flex flex-wrap gap-1.5">
                                <span v-for="tag in detectedVariables" :key="tag"
                                    class="px-2 py-0.5 text-[10px] font-mono rounded bg-[#141414] text-[#D4AF37] border border-[#BC9A1D]/40">
                                    &#123;&#123;{{ tag }}&#125;&#125;
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Vault Snippets Library -->
                    <div class="p-4 bg-[#0c0c0c] rounded-2xl border border-[#1a1a1a] shadow-xl">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                                <i class="pi pi-th-large text-[#D4AF37]"></i>
                                <span>Vault Snippets</span>
                            </h4>
                        </div>
                        <p class="text-[11px] text-[#a0a0a0] mb-3">
                            Responsive components matching Vision148 Vault:
                        </p>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <button type="button" @click="insertSnippet('gold_btn')"
                                class="p-2.5 rounded-xl bg-[#141414] border border-[#222] hover:border-[#D4AF37] text-left transition flex items-center gap-1.5 text-[#e4e4e7] hover:text-[#D4AF37]">
                                <i class="pi pi-external-link text-[#D4AF37] text-xs"></i>
                                <span>Gold Button</span>
                            </button>
                            <button type="button" @click="insertSnippet('gold_otp')"
                                class="p-2.5 rounded-xl bg-[#141414] border border-[#222] hover:border-[#D4AF37] text-left transition flex items-center gap-1.5 text-[#e4e4e7] hover:text-[#D4AF37]">
                                <i class="pi pi-key text-[#D4AF37] text-xs"></i>
                                <span>Gold OTP</span>
                            </button>
                            <button type="button" @click="insertSnippet('status_banner')"
                                class="p-2.5 rounded-xl bg-[#141414] border border-[#222] hover:border-[#D4AF37] text-left transition flex items-center gap-1.5 text-[#e4e4e7] hover:text-[#D4AF37]">
                                <i class="pi pi-shield text-[#D4AF37] text-xs"></i>
                                <span>Status Banner</span>
                            </button>
                            <button type="button" @click="insertSnippet('vault_card')"
                                class="p-2.5 rounded-xl bg-[#141414] border border-[#222] hover:border-[#D4AF37] text-left transition flex items-center gap-1.5 text-[#e4e4e7] hover:text-[#D4AF37]">
                                <i class="pi pi-credit-card text-[#D4AF37] text-xs"></i>
                                <span>Vault Card</span>
                            </button>
                            <button type="button" @click="insertSnippet('sender_table')"
                                class="p-2.5 rounded-xl bg-[#141414] border border-[#222] hover:border-[#D4AF37] text-left transition flex items-center gap-1.5 text-[#e4e4e7] hover:text-[#D4AF37]">
                                <i class="pi pi-table text-[#D4AF37] text-xs"></i>
                                <span>Info Table</span>
                            </button>
                            <button type="button" @click="insertSnippet('vault_footer')"
                                class="p-2.5 rounded-xl bg-[#141414] border border-[#222] hover:border-[#D4AF37] text-left transition flex items-center gap-1.5 text-[#e4e4e7] hover:text-[#D4AF37]">
                                <i class="pi pi-id-card text-[#D4AF37] text-xs"></i>
                                <span>Vault Footer</span>
                            </button>
                        </div>
                    </div>

                    <!-- Template Quick Metrics -->
                    <div class="p-3.5 bg-[#0c0c0c] rounded-2xl border border-[#1a1a1a] flex items-center justify-around text-center shadow-xl">
                        <div>
                            <span class="block text-sm font-bold text-white">{{ templateStats.words }}</span>
                            <span class="text-[10px] text-[#71717a]">Words</span>
                        </div>
                        <div class="h-6 w-px bg-[#222]"></div>
                        <div>
                            <span class="block text-sm font-bold text-white">{{ templateStats.chars }}</span>
                            <span class="text-[10px] text-[#71717a]">Characters</span>
                        </div>
                        <div class="h-6 w-px bg-[#222]"></div>
                        <div>
                            <span class="block text-sm font-bold text-[#D4AF37]">{{ detectedVariables.length }}</span>
                            <span class="text-[10px] text-[#71717a]">Variables</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        <!-- Custom Vault Footer -->
        <template #footer>
            <div class="flex items-center justify-between w-full pt-3.5 border-t border-[#1a1a1a] bg-[#050505] px-2">
                <div class="text-xs text-[#71717a] hidden sm:block">
                    <span>Status: </span>
                    <span :class="formData.status == 1 ? 'text-[#D4AF37] font-semibold' : 'text-zinc-500 font-semibold'">
                        {{ formData.status == 1 ? 'Active (Live for automated dispatches)' : 'Draft (Saved internally)' }}
                    </span>
                </div>

                <div class="flex items-center gap-3">
                    <Button v-if="isLoading" severity="secondary" style="cursor: not-allowed; width: 110px;" class="!bg-[#141414] !border-[#222]">
                        <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="8" animationDuration=".5s" />
                    </Button>
                    <template v-else>
                        <Button type="button" label="Cancel" severity="secondary" outlined
                            class="transition-all duration-300 !border-[#222] !text-[#a0a0a0] hover:!text-white hover:!border-[#444]"
                            @click="$emit('close')">
                            <template #icon="{ class: iconClass }">
                                <i class="pi pi-times mr-1.5" :class="iconClass"></i>
                            </template>
                        </Button>

                        <button type="button"
                            @click="modalTitle === 'Create' ? createHandler() : updateHandler()"
                            class="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#BC9A1D] to-[#D4AF37] shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2">
                            <i :class="modalTitle === 'Create' ? 'pi pi-plus' : 'pi pi-check'"></i>
                            <span>{{ modalTitle === 'Create' ? 'Save & Create Template' : 'Save & Update Template' }}</span>
                        </button>
                    </template>
                </div>
            </div>
        </template>
    </Dialog>

    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss">
/* Vision148 Vault & Gold Theme Overrides */
.vault-dialog-theme {
    .p-dialog-header {
        background: #050505 !important;
        border-color: #1a1a1a !important;
        padding: 1.25rem 1.5rem !important;
    }

    .p-dialog-content {
        background: #050505 !important;
        color: #e4e4e7 !important;
    }

    .p-dialog-footer {
        background: #050505 !important;
        border-color: #1a1a1a !important;
        padding: 1.25rem 1.5rem !important;
    }
}

/* Gold Switch */
.gold-switch.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
    background: linear-gradient(165deg, #BC9A1D 0%, #D4AF37 100%) !important;
}

/* Enhanced PrimeVue Editor styling for Vision148 Vault */
.vault-quill-editor {
    display: flex;
    flex-direction: column;
    flex: 1;

    .p-editor-toolbar {
        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
        background: #0c0c0c !important;
        border-color: #1a1a1a !important;

        .ql-picker-label, .ql-stroke {
            stroke: #a0a0a0 !important;
            color: #a0a0a0 !important;
        }

        .ql-fill {
            fill: #a0a0a0 !important;
        }

        button:hover .ql-stroke,
        .ql-picker:hover .ql-stroke,
        button:hover .ql-picker-label {
            stroke: #D4AF37 !important;
            color: #D4AF37 !important;
        }

        button:hover .ql-fill {
            fill: #D4AF37 !important;
        }

        .ql-active .ql-stroke {
            stroke: #D4AF37 !important;
        }

        .ql-active .ql-fill {
            fill: #D4AF37 !important;
        }
    }

    .p-editor-content {
        border-bottom-left-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
        border-color: #1a1a1a !important;
        background: #0c0c0c !important;
        flex: 1;
        display: flex;
        flex-direction: column;

        .ql-editor {
            flex: 1;
            min-height: 380px;
            color: #e4e4e7 !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

            p {
                margin-bottom: 0.85rem;
                line-height: 1.7;
            }

            h1, h2, h3 {
                color: #D4AF37;
            }

            a {
                color: #D4AF37;
            }
        }
    }
}

/* Rendered preview styling strictly matching email_template_vision148.blade.php */
.vault-preview-rendered {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #e0e0e0;
    line-height: 1.7;

    p {
        margin: 0 0 16px 0;
        color: #a0a0a0;
        font-size: 15px;
    }

    h1 {
        color: #D4AF37;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 24px;
        letter-spacing: -0.5px;
    }

    h2 {
        color: #ffffff;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 18px;
    }

    h3 {
        color: #D4AF37;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    a {
        color: #D4AF37;
    }
}
</style>