const fs = require('fs');
const path = require('path');

const targets = [
    {
        dir: 'slots-management',
        title: 'Slots Requests',
        endpoint: 'v1/admin/slots-management'
    },
    {
        dir: 'slots-alloted',
        title: 'Allotted Slots',
        endpoint: 'v1/admin/slots-alloted'
    },
    {
        dir: 'slots-rejected',
        title: 'Rejected Slots',
        endpoint: 'v1/admin/slots-rejected'
    },
    {
        dir: 'slots-post',
        title: 'Total Slots',
        endpoint: 'v1/admin/slots-post'
    }
];

const basePath = '/media/dolar/office/projects/vision-frontend/app/pages/admin-panel';

targets.forEach(target => {
    const file = path.join(basePath, target.dir, 'index.vue');
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove tabs JS logic
    content = content.replace(/const activeTab = ref\('all'\);[\s\S]*?const getStatusForTab = \(\) => \{[\s\S]*?\};\n/, '');

    // 2. Replace loadData logic
    const oldLoadData = `const loadData = async () => {
    isLoading.value = true;
    try {
        let endpoint = \`v1/admin/allocation-requests\`;
        let params = {
            page: route.query.page || 1,
            length: 10,
        };
        
        if (activeTab.value === 'missing_docs') {
            endpoint = \`v1/admin/allocation-requests-without-documents\`;
        } else if (activeTab.value !== 'all') {
            params.status = getStatusForTab();
        }

        const getData = await $fetchAdmin(endpoint, {
            method: 'GET',
            params
        });`;

    const newLoadData = `const loadData = async () => {
    isLoading.value = true;
    try {
        const getData = await $fetchAdmin(\`${target.endpoint}\`, {
            method: 'GET',
            params: {
                page: route.query.page || 1,
                length: 10,
            }
        });`;

    content = content.replace(oldLoadData, newLoadData);

    // 3. Remove tabs HTML
    const oldTabsHtml = `                <!-- Tabs Navigation -->
                <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.id"
                        @click="setTab(tab.id)"
                        :class="[
                            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                            activeTab === tab.id 
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>`;
    content = content.replace(oldTabsHtml, '');

    // 4. Update Title
    content = content.replace(
        '<h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Allocation Requests</h3>',
        `<h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">${target.title}</h3>`
    );

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
