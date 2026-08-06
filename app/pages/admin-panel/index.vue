<script setup>
useHead({ title: 'Dashboard – Admin Panel' });
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

// ─── State ────────────────────────────────────────────────────────────────────
const isLoading   = ref(true);
const lastUpdated = ref(null);

// Raw API data
const dashData      = ref({});
const allocations   = ref([]);
const recentUsers   = ref([]);
const recentPayments = ref([]);
const contacts       = ref([]);

// Chart refs
const chartAllocationStatus  = ref({ data: null, opts: null });
const chartUserStatus        = ref({ data: null, opts: null });
const chartAssetStatus       = ref({ data: null, opts: null });
const chartDocSignStatus     = ref({ data: null, opts: null });
const chartPaymentMethod     = ref({ data: null, opts: null });
const chartCryptoStatus      = ref({ data: null, opts: null });
const chartContent           = ref({ data: null, opts: null });
const chartAllocTrend        = ref({ data: null, opts: null });
const chartRevenueTrend      = ref({ data: null, opts: null });
const chartSharesProgress    = ref({ data: null, opts: null });

// ─── Load ─────────────────────────────────────────────────────────────────────
const load = async () => {
  isLoading.value = true;
  try {
    const [main, usersRes, allocRes, itemsRes, paymentsRes, contactsRes] =
      await Promise.allSettled([
        $fetchAdmin('v1/admin/dashboard',    { method: 'GET' }),
        $fetchAdmin('v1/admin/users/all',    { method: 'POST', body: { paginate: true, page: 1, length: 6 } }),
        $fetchAdmin('v1/admin/allocation-requests', { method: 'GET' }),
        $fetchAdmin('v1/admin/fractional-items', { method: 'GET' }),
        $fetchAdmin('v1/admin/allocation-payments', { method: 'GET' }),
        $fetchAdmin('v1/admin/contacts/all', { method: 'POST', body: { paginate: true, page: 1, length: 6 } }),
      ]);

    if (main.status === 'fulfilled') {
      dashData.value = main.value?.data ?? {};
      buildAllCharts();
    }

    if (usersRes.status === 'fulfilled') {
      const u = usersRes.value?.data;
      recentUsers.value = (u?.data ?? []).slice(0, 6);
      if (!dashData.value.users) dashData.value.users = {};
      if (!dashData.value.users.total_users) {
        dashData.value.users.total_users = u?.meta?.total ?? recentUsers.value.length;
      }
    }

    if (allocRes.status === 'fulfilled') {
      const a = allocRes.value?.data;
      allocations.value = (Array.isArray(a) ? a : (a?.data ?? [])).slice(0, 6);
    }

    if (itemsRes.status === 'fulfilled') {
      const fi = itemsRes.value?.data;
      const items = Array.isArray(fi) ? fi : (fi?.data ?? []);
      buildSharesProgress(items);
    }

    if (paymentsRes.status === 'fulfilled') {
      const p = paymentsRes.value?.data;
      recentPayments.value = (Array.isArray(p) ? p : (p?.data ?? [])).slice(0, 6);
      buildPaymentMethodChart(recentPayments.value);
    }

    if (contactsRes.status === 'fulfilled') {
      const c = contactsRes.value?.data;
      contacts.value = (c?.data ?? []).slice(0, 5);
    }

    lastUpdated.value = new Date().toLocaleTimeString('en-GB');
  } catch (e) {
    console.error('Dashboard error:', e);
  } finally {
    isLoading.value = false;
  }
};

// ─── Derived shorthand ────────────────────────────────────────────────────────
const u  = computed(() => dashData.value.users               ?? {});
const v  = computed(() => dashData.value.vehicles            ?? {});
const fo = computed(() => dashData.value.fractional_ownership ?? {});
const ds = computed(() => dashData.value.document_signatures ?? {});
const cp = computed(() => dashData.value.crypto_payments     ?? {});
const sp = computed(() => dashData.value.support             ?? {});
const ct = computed(() => dashData.value.content             ?? {});
const en = computed(() => dashData.value.engagement          ?? {});

// ─── Chart builders ───────────────────────────────────────────────────────────
const buildAllCharts = () => {
  nextTick(() => {
    buildUserStatusChart();
    buildAssetStatusChart();
    buildDocSignChart();
    buildCryptoStatusChart();
    buildContentChart();
    buildAllocationStatusChart();
    buildRevenueTrendChart();
    buildAllocTrendChart();
  });
};

const css = () => {
  const s = getComputedStyle(document.documentElement);
  return {
    text:   s.getPropertyValue('--p-text-color')         || '#e2e8f0',
    muted:  s.getPropertyValue('--p-text-muted-color')   || '#94a3b8',
    border: s.getPropertyValue('--p-content-border-color')|| '#334155',
  };
};

const baseLineOpts = (c) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: c.text, font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: c.muted }, grid: { color: c.border, drawBorder: false } },
    y: { ticks: { color: c.muted }, grid: { color: c.border, drawBorder: false }, beginAtZero: true },
  },
});

const baseDoughnutOpts = (c, pos = 'right') => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { position: pos, labels: { color: c.text, padding: 14, font: { size: 11 } } },
  },
});

const basePieOpts = (c) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { color: c.text, padding: 14, font: { size: 11 } } },
  },
});

const buildUserStatusChart = () => {
  const c = css();
  const total  = u.value.total_users   ?? 0;
  const active = u.value.active_users  ?? 0;
  const admins = u.value.total_admins  ?? 0;
  const cust   = u.value.total_customers ?? 0;
  chartUserStatus.value = {
    data: {
      labels: ['Customers', 'Admins', 'Inactive'],
      datasets: [{ data: [cust, admins, Math.max(0, total - active)],
        backgroundColor: ['#6366f1','#f59e0b','#64748b'], hoverOffset: 8 }],
    },
    opts: baseDoughnutOpts(c),
  };
};

const buildAssetStatusChart = () => {
  const c = css();
  const items = fo.value;
  chartAssetStatus.value = {
    data: {
      labels: ['Live','Upcoming','Sold','Draft','Inactive'],
      datasets: [{ data: [
        items.live_items ?? 0,
        0, 0,
        items.total_items ? Math.max(0, items.total_items - (items.live_items ?? 0)) : 0,
        0,
      ],
        backgroundColor: ['#10b981','#f59e0b','#6366f1','#64748b','#ef4444'], hoverOffset: 8 }],
    },
    opts: baseDoughnutOpts(c),
  };
};

const buildDocSignChart = () => {
  const c = css();
  const total     = ds.value.total_signatures ?? 0;
  const completed = ds.value.completed_signatures ?? 0;
  chartDocSignStatus.value = {
    data: {
      labels: ['Signed','Pending'],
      datasets: [{ data: [completed, Math.max(0, total - completed)],
        backgroundColor: ['#10b981','#f59e0b'], hoverOffset: 8 }],
    },
    opts: baseDoughnutOpts(c, 'bottom'),
  };
};

const buildCryptoStatusChart = () => {
  const c = css();
  chartCryptoStatus.value = {
    data: {
      labels: ['Completed','Pending/Other'],
      datasets: [{ data: [cp.value.completed_payments ?? 0, Math.max(0, (cp.value.total_payments ?? 0) - (cp.value.completed_payments ?? 0))],
        backgroundColor: ['#10b981','#94a3b8'], hoverOffset: 8 }],
    },
    opts: baseDoughnutOpts(c, 'bottom'),
  };
};

const buildContentChart = () => {
  const c = css();
  chartContent.value = {
    data: {
      labels: ['Blogs','News','Events'],
      datasets: [{
        data: [ct.value.total_blogs ?? 0, ct.value.total_news ?? 0, ct.value.total_events ?? 0],
        backgroundColor: ['#6366f1','#f59e0b','#10b981'],
        borderRadius: 6,
      }],
    },
    opts: {
      ...baseLineOpts(c),
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: c.muted }, grid: { display: false } },
        y: { ticks: { color: c.muted }, grid: { color: c.border, drawBorder: false }, beginAtZero: true },
      },
    },
  };
};

const buildAllocationStatusChart = () => {
  const c = css();
  const f = fo.value;
  chartAllocationStatus.value = {
    data: {
      labels: ['Pending Payment','Pending Verification','Completed','Cancelled'],
      datasets: [{
        data: [
          f.pending_requests ? Math.round(f.pending_requests * 0.4) : 0,
          f.pending_requests ?? 0,
          f.total_shares_sold ? f.total_requests - f.pending_requests : 0,
          0,
        ],
        backgroundColor: ['#f59e0b','#6366f1','#10b981','#ef4444'], hoverOffset: 8,
      }],
    },
    opts: basePieOpts(c),
  };
};

const buildPaymentMethodChart = (payments) => {
  const c = css();
  const methods = {};
  payments.forEach(p => {
    const m = p.payment_method ?? 'Other';
    methods[m] = (methods[m] ?? 0) + 1;
  });
  if (!Object.keys(methods).length) {
    methods['Stripe'] = 0; methods['PayPal'] = 0; methods['Crypto'] = 0;
  }
  chartPaymentMethod.value = {
    data: {
      labels: Object.keys(methods),
      datasets: [{
        data: Object.values(methods),
        backgroundColor: ['#6366f1','#f59e0b','#10b981','#ef4444','#64748b'], hoverOffset: 8,
      }],
    },
    opts: basePieOpts(c),
  };
};

const buildSharesProgress = (items) => {
  const c = css();
  const top = items.slice(0, 6);
  chartSharesProgress.value = {
    data: {
      labels: top.map(i => i.item_name ?? i.headline ?? `Asset ${i.id}`),
      datasets: [
        {
          label: 'Shares Sold',
          data: top.map(i => (i.shares_total ?? 0) - (i.shares_available ?? 0)),
          backgroundColor: '#6366f1',
          borderRadius: 6,
          stack: 'shares',
        },
        {
          label: 'Shares Available',
          data: top.map(i => i.shares_available ?? 0),
          backgroundColor: '#e0e7ff',
          borderRadius: 6,
          stack: 'shares',
        },
      ],
    },
    opts: {
      ...baseLineOpts(c),
      indexAxis: 'y',
      plugins: { legend: { labels: { color: c.text, font: { size: 11 } } } },
    },
  };
};

const buildAllocTrendChart = () => {
  const c = css();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
    return months[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2);
  });
  const trends = fo.value.allocation_trend || last7.map(() => 0);
  chartAllocTrend.value = {
    data: {
      labels: last7,
      datasets: [{
        label: 'Requests',
        data: trends,
        fill: true, tension: 0.4,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.12)',
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      }],
    },
    opts: baseLineOpts(c),
  };
};

const buildRevenueTrendChart = () => {
  const c = css();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
    return months[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2);
  });
  const rTrend = fo.value.revenue_trend || last7.map(() => 0);
  const pTrend = fo.value.pending_revenue_trend || last7.map(() => 0);
  chartRevenueTrend.value = {
    data: {
      labels: last7,
      datasets: [
        {
          label: 'Revenue (£)',
          data: rTrend,
          fill: true, tension: 0.4,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.12)',
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
        },
        {
          label: 'Pending (£)',
          data: pTrend,
          fill: false, tension: 0.4,
          borderDash: [5,5],
          borderColor: '#f59e0b',
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
        },
      ],
    },
    opts: baseLineOpts(c),
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val) => new Intl.NumberFormat('en').format(val ?? 0);
const fmtCurrency = (val) => val != null
  ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)
  : '—';
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const allocBadgeClass = (s) => ({ 0:'badge-warning', 1:'badge-info', 2:'badge-success', 3:'badge-danger' }[s] ?? 'badge-neutral');
const allocBadgeLabel = (s) => ({ 0:'Pend. Payment', 1:'Pending Verify', 2:'Completed', 3:'Cancelled' }[s] ?? 'Unknown');

const userName = (u) => {
  if (!u) return '—';
  const n = `${u.user_info?.first_name ?? ''} ${u.user_info?.last_name ?? ''}`.trim();
  return n || u.email || '—';
};

const kycClass = (s) => {
  if (!s) return 'badge-neutral';
  if (s === 'verified') return 'badge-success';
  if (s === 'pending')  return 'badge-warning';
  return 'badge-danger';
};

onMounted(load);
</script>

<template>
  <div class="db-root">

    <!-- ══ Header ══════════════════════════════════════════════════════════ -->
    <div class="db-header">
      <div>
        <p class="db-eyebrow">Admin Panel</p>
        <h1 class="db-title">Analytics Dashboard</h1>
        <p class="db-sub" v-if="lastUpdated">Last updated at {{ lastUpdated }}</p>
      </div>
      <button class="db-refresh" @click="load" :disabled="isLoading">
        <i :class="['fa-solid fa-arrows-rotate', { 'spin': isLoading }]"></i>
        Refresh
      </button>
    </div>

    <!-- ══ KPI Strip ════════════════════════════════════════════════════════ -->
    <div class="kpi-strip">
      <div v-for="(kpi, i) in [
        { icon:'fa-users',        label:'Total Users',       val: fmt(u.total_users),       sub: fmt(u.active_users)+' active',              color:'indigo' },
        { icon:'fa-car',          label:'Vehicles',          val: fmt(v.total_vehicles),    sub: fmt(v.restoration_cars)+' restoration',      color:'rose' },
        { icon:'fa-layer-group',  label:'Fractional Assets', val: fmt(fo.total_items),      sub: fmt(fo.live_items)+' live',                  color:'emerald' },
        { icon:'fa-handshake',    label:'Allocations',       val: fmt(fo.total_requests),   sub: fmt(fo.pending_requests)+' pending',          color:'amber' },
        { icon:'fa-sack-dollar',  label:'Revenue',           val: fmtCurrency(fo.total_revenue), sub: fmtCurrency(fo.pending_revenue)+' pending', color:'violet' },
        { icon:'fa-file-signature', label:'Signatures',      val: fmt(ds.total_signatures), sub: fmt(ds.completed_signatures)+' completed',   color:'teal' },
        { icon:'fa-bitcoin-sign', label:'Crypto Payments',   val: fmt(cp.total_payments),   sub: fmt(cp.completed_payments)+' completed',     color:'orange' },
        { icon:'fa-rss',          label:'Subscribers',       val: fmt(en.total_subscribers),sub: fmt(sp.total_contacts)+' contacts',          color:'pink' },
      ]" :key="i" :class="`kpi-card kpi-${kpi.color}`">
        <div class="kpi-ico"><i :class="`fa-solid ${kpi.icon}`"></i></div>
        <div class="kpi-body">
          <p class="kpi-lbl">{{ kpi.label }}</p>
          <p class="kpi-val">
            <Skeleton v-if="isLoading" width="5rem" height="1.75rem" />
            <template v-else>{{ kpi.val }}</template>
          </p>
          <p class="kpi-sub">{{ kpi.sub }}</p>
        </div>
      </div>
    </div>

    <!-- ══ Row 1: Trend charts ═════════════════════════════════════════════ -->
    <div class="row-2-1">
      <!-- Allocation trend -->
      <div class="chart-card span-2">
        <div class="card-hd">
          <h3><i class="fa-solid fa-chart-area mr-2 text-indigo-400"></i>Allocation Requests — Monthly Trend</h3>
        </div>
        <Skeleton v-if="isLoading" width="100%" height="240px" />
        <div v-else class="h-[260px]">
          <Chart v-if="chartAllocTrend.data" type="line" :data="chartAllocTrend.data" :options="chartAllocTrend.opts" class="w-full h-full" />
          <div v-else class="chart-empty">No trend data — connect <code>reports/dashboard</code></div>
        </div>
      </div>

      <!-- User type doughnut -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-users mr-2 text-indigo-400"></i>User Types</h3>
        </div>
        <Skeleton v-if="isLoading" width="100%" height="240px" />
        <div v-else class="h-[260px] flex items-center justify-center">
          <Chart v-if="chartUserStatus.data" type="doughnut" :data="chartUserStatus.data" :options="chartUserStatus.opts" class="w-full h-full" />
          <div v-else class="chart-empty">No data</div>
        </div>
      </div>
    </div>

    <!-- ══ Row 2: Revenue + Asset Status + Doc Sigs ═══════════════════════ -->
    <div class="row-3">
      <!-- Revenue Trend -->
      <div class="chart-card span-2">
        <div class="card-hd">
          <h3><i class="fa-solid fa-chart-line mr-2 text-emerald-400"></i>Revenue Trend</h3>
          <div class="card-hd-badge">
            <span class="badge badge-success">Completed: {{ fmtCurrency(fo.total_revenue) }}</span>
            <span class="badge badge-warning">Pending: {{ fmtCurrency(fo.pending_revenue) }}</span>
          </div>
        </div>
        <Skeleton v-if="isLoading" width="100%" height="240px" />
        <div v-else class="h-[260px]">
          <Chart v-if="chartRevenueTrend.data" type="line" :data="chartRevenueTrend.data" :options="chartRevenueTrend.opts" class="w-full h-full" />
        </div>
      </div>

      <!-- Asset Status -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-circle-half-stroke mr-2 text-emerald-400"></i>Asset Status</h3>
        </div>
        <Skeleton v-if="isLoading" width="100%" height="240px" />
        <div v-else class="h-[260px] flex items-center justify-center">
          <Chart v-if="chartAssetStatus.data" type="doughnut" :data="chartAssetStatus.data" :options="chartAssetStatus.opts" class="w-full h-full" />
        </div>
      </div>
    </div>

    <!-- ══ Row 3: Shares Progress + Allocation Status + Payment Method ═════ -->
    <div class="row-3">
      <!-- Shares Sold vs Available per Asset -->
      <div class="chart-card span-2">
        <div class="card-hd">
          <h3><i class="fa-solid fa-chart-bar mr-2 text-violet-400"></i>Shares Sold vs Available (Top Assets)</h3>
        </div>
        <Skeleton v-if="isLoading" width="100%" height="280px" />
        <div v-else class="h-[300px]">
          <Chart v-if="chartSharesProgress.data" type="bar" :data="chartSharesProgress.data" :options="chartSharesProgress.opts" class="w-full h-full" />
          <div v-else class="chart-empty">No fractional item data</div>
        </div>
      </div>

      <!-- Allocation Request Status Pie -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-briefcase mr-2 text-amber-400"></i>Request Status</h3>
        </div>
        <Skeleton v-if="isLoading" width="100%" height="280px" />
        <div v-else class="h-[300px] flex flex-col justify-center">
          <!-- Stat pills -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div class="stat-pill stat-pill--amber">
              <span class="stat-pill-val">{{ fmt(fo.pending_requests) }}</span>
              <span class="stat-pill-lbl">Pending</span>
            </div>
            <div class="stat-pill stat-pill--emerald">
              <span class="stat-pill-val">{{ fmt(fo.total_requests ? fo.total_requests - fo.pending_requests : 0) }}</span>
              <span class="stat-pill-lbl">Resolved</span>
            </div>
            <div class="stat-pill stat-pill--indigo">
              <span class="stat-pill-val">{{ fmt(fo.total_shares_sold) }}</span>
              <span class="stat-pill-lbl">Shares Sold</span>
            </div>
            <div class="stat-pill stat-pill--violet">
              <span class="stat-pill-val">{{ fmt(fo.total_requests) }}</span>
              <span class="stat-pill-lbl">Total</span>
            </div>
          </div>
          <div class="h-[160px] flex items-center justify-center">
            <Chart v-if="chartAllocationStatus.data" type="pie" :data="chartAllocationStatus.data" :options="chartAllocationStatus.opts" class="w-full h-full" />
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Row 4: Document Sigs + Crypto + Content Bar + KYC Progress ═════ -->
    <div class="row-4">
      <!-- Document Signatures -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-file-signature mr-2 text-teal-400"></i>Document Signatures</h3>
        </div>
        <div v-if="isLoading" class="chart-skeleton"><Skeleton width="100%" height="200px" /></div>
        <div v-else>
          <div class="progress-stat">
            <span class="ps-label">Templates</span>
            <span class="ps-val">{{ fmt(ds.total_templates) }}</span>
          </div>
          <div class="progress-stat">
            <span class="ps-label">Total Signatures</span>
            <span class="ps-val">{{ fmt(ds.total_signatures) }}</span>
          </div>
          <div class="ps-prog-wrap">
            <div class="ps-prog-bar">
              <div class="ps-prog-fill ps-prog-fill--teal"
                   :style="{ width: pct(ds.completed_signatures, ds.total_signatures) + '%' }"></div>
            </div>
            <span class="ps-prog-pct">{{ pct(ds.completed_signatures, ds.total_signatures) }}% signed</span>
          </div>
          <div class="h-[160px] mt-3">
            <Chart v-if="chartDocSignStatus.data" type="doughnut" :data="chartDocSignStatus.data" :options="chartDocSignStatus.opts" class="w-full h-full" />
          </div>
        </div>
      </div>

      <!-- Crypto Payments -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-brands fa-bitcoin mr-2 text-orange-400"></i>Crypto Payments</h3>
        </div>
        <div v-if="isLoading" class="chart-skeleton"><Skeleton width="100%" height="200px" /></div>
        <div v-else>
          <div class="progress-stat">
            <span class="ps-label">Active Channels</span>
            <span class="ps-val">{{ fmt(cp.active_channels) }} / {{ fmt(cp.total_channels) }}</span>
          </div>
          <div class="progress-stat">
            <span class="ps-label">Total Transactions</span>
            <span class="ps-val">{{ fmt(cp.total_payments) }}</span>
          </div>
          <div class="ps-prog-wrap">
            <div class="ps-prog-bar">
              <div class="ps-prog-fill ps-prog-fill--orange"
                   :style="{ width: pct(cp.completed_payments, cp.total_payments) + '%' }"></div>
            </div>
            <span class="ps-prog-pct">{{ pct(cp.completed_payments, cp.total_payments) }}% completed</span>
          </div>
          <div class="h-[160px] mt-3">
            <Chart v-if="chartCryptoStatus.data" type="doughnut" :data="chartCryptoStatus.data" :options="chartCryptoStatus.opts" class="w-full h-full" />
          </div>
        </div>
      </div>

      <!-- Content Stats -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-newspaper mr-2 text-indigo-400"></i>Content</h3>
        </div>
        <div v-if="isLoading" class="chart-skeleton"><Skeleton width="100%" height="200px" /></div>
        <div v-else>
          <div class="content-pills">
            <div class="cp-pill cp-pill--indigo"><span class="cp-val">{{ fmt(ct.total_blogs) }}</span><span class="cp-lbl">Blogs</span></div>
            <div class="cp-pill cp-pill--amber"><span class="cp-val">{{ fmt(ct.total_news) }}</span><span class="cp-lbl">News</span></div>
            <div class="cp-pill cp-pill--emerald"><span class="cp-val">{{ fmt(ct.total_events) }}</span><span class="cp-lbl">Events</span></div>
          </div>
          <div class="h-[180px] mt-3">
            <Chart v-if="chartContent.data" type="bar" :data="chartContent.data" :options="chartContent.opts" class="w-full h-full" />
          </div>
        </div>
      </div>

      <!-- Payment Method Breakdown -->
      <div class="chart-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-credit-card mr-2 text-violet-400"></i>Payment Methods</h3>
        </div>
        <div v-if="isLoading" class="chart-skeleton"><Skeleton width="100%" height="200px" /></div>
        <div v-else class="h-[250px] flex items-center justify-center">
          <Chart v-if="chartPaymentMethod.data" type="pie" :data="chartPaymentMethod.data" :options="chartPaymentMethod.opts" class="w-full h-full" />
          <div v-else class="chart-empty">No payment data</div>
        </div>
      </div>
    </div>

    <!-- ══ Row 5: Engagement strip ════════════════════════════════════════ -->
    <div class="engage-strip">
      <div v-for="(e, i) in [
        { label:'Subscribers',      val: fmt(en.total_subscribers),   icon:'fa-rss',             color:'pink' },
        { label:'KYC Documents',    val: fmt(en.total_kyc_documents), icon:'fa-id-card',          color:'teal' },
        { label:'Support Tickets',  val: fmt(sp.total_support_tickets), icon:'fa-headset',        color:'amber' },
        { label:'Contact Messages', val: fmt(sp.total_contacts),      icon:'fa-envelope',         color:'indigo' },
        { label:'Doc Templates',    val: fmt(ds.total_templates),     icon:'fa-file-lines',       color:'violet' },
        { label:'Crypto Channels',  val: fmt(cp.total_channels),      icon:'fa-link',             color:'orange' },
      ]" :key="i" :class="`engage-card engage-${e.color}`">
        <i :class="`fa-solid ${e.icon} text-xl mb-2`"></i>
        <p class="engage-val">
          <Skeleton v-if="isLoading" width="3rem" height="1.5rem" />
          <template v-else>{{ e.val }}</template>
        </p>
        <p class="engage-lbl">{{ e.label }}</p>
      </div>
    </div>

    <!-- ══ Row 6: Recent activity tables ══════════════════════════════════ -->
    <div class="row-3">
      <!-- Recent Allocation Requests -->
      <div class="recent-card span-2">
        <div class="card-hd">
          <h3><i class="fa-solid fa-clock-rotate-left mr-2 text-amber-400"></i>Recent Allocation Requests</h3>
          <NuxtLink to="/admin-panel/bid-list" class="view-all">View all →</NuxtLink>
        </div>
        <div v-if="isLoading" class="space-y-2">
          <div v-for="i in 6" :key="i" class="flex gap-3 items-center">
            <Skeleton width="2.5rem" height="2.5rem" shape="circle" />
            <div class="flex-1 space-y-1"><Skeleton width="55%" height="0.8rem" /><Skeleton width="35%" height="0.7rem" /></div>
            <Skeleton width="5.5rem" height="1.4rem" borderRadius="999px" />
          </div>
        </div>
        <div v-else-if="allocations.length">
          <div v-for="a in allocations" :key="a.id" class="tbl-row">
            <div class="tbl-avatar tbl-avatar--amber"><i class="fa-solid fa-file-contract"></i></div>
            <div class="tbl-info">
              <p class="tbl-name">{{ a.slug ?? `Req #${a.id}` }}</p>
              <p class="tbl-meta">{{ a.shares_count ?? 0 }} shares · {{ fmtCurrency(a.total_amount) }}</p>
            </div>
            <div class="ml-auto flex flex-col items-end gap-1">
              <span :class="['badge', allocBadgeClass(a.status)]">{{ allocBadgeLabel(a.status) }}</span>
              <span class="text-xs text-gray-400">{{ a.payment_method ?? '—' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="chart-empty">No allocation requests yet</div>
      </div>

      <!-- Recent Users -->
      <div class="recent-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-user-clock mr-2 text-indigo-400"></i>Recent Users</h3>
          <NuxtLink to="/admin-panel/users" class="view-all">View all →</NuxtLink>
        </div>
        <div v-if="isLoading" class="space-y-2">
          <div v-for="i in 6" :key="i" class="flex gap-3 items-center">
            <Skeleton width="2.5rem" height="2.5rem" shape="circle" />
            <div class="flex-1 space-y-1"><Skeleton width="55%" height="0.8rem" /><Skeleton width="35%" height="0.7rem" /></div>
            <Skeleton width="4rem" height="1.4rem" borderRadius="999px" />
          </div>
        </div>
        <div v-else-if="recentUsers.length">
          <div v-for="usr in recentUsers" :key="usr.id" class="tbl-row">
            <img :src="usr.photo ?? '/svg/not-found-img.svg'" :alt="userName(usr)" class="tbl-img" />
            <div class="tbl-info">
              <p class="tbl-name">{{ userName(usr) }}</p>
              <p class="tbl-meta">{{ usr.email }}</p>
            </div>
            <div class="ml-auto flex flex-col items-end gap-1">
              <span :class="['badge', usr.status == 1 ? 'badge-success' : 'badge-danger']">
                {{ usr.status == 1 ? 'Active' : 'Inactive' }}
              </span>
              <span :class="['badge text-xs', kycClass(usr.kyc_status)]">KYC: {{ usr.kyc_status ?? 'unset' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="chart-empty">No users yet</div>
      </div>
    </div>

    <!-- ══ Row 7: Payments + Contacts ════════════════════════════════════ -->
    <div class="row-2-1">
      <!-- Recent Payments -->
      <div class="recent-card span-2">
        <div class="card-hd">
          <h3><i class="fa-solid fa-wallet mr-2 text-emerald-400"></i>Recent Payments</h3>
          <NuxtLink to="/admin-panel/payment-history" class="view-all">View all →</NuxtLink>
        </div>
        <div v-if="isLoading" class="space-y-2">
          <div v-for="i in 6" :key="i" class="flex gap-3 items-center">
            <Skeleton width="2.5rem" height="2.5rem" shape="circle" />
            <div class="flex-1 space-y-1"><Skeleton width="55%" height="0.8rem" /><Skeleton width="35%" height="0.7rem" /></div>
            <Skeleton width="5.5rem" height="1.4rem" borderRadius="999px" />
          </div>
        </div>
        <div v-else-if="recentPayments.length">
          <div v-for="p in recentPayments" :key="p.id" class="tbl-row">
            <div class="tbl-avatar tbl-avatar--emerald"><i class="fa-solid fa-credit-card"></i></div>
            <div class="tbl-info">
              <p class="tbl-name">{{ p.transaction_id ?? `Pay #${p.id}` }}</p>
              <p class="tbl-meta">{{ p.payment_method ?? '—' }} · {{ p.currency ?? 'GBP' }}</p>
            </div>
            <div class="ml-auto flex flex-col items-end gap-1">
              <span class="font-bold text-emerald-400 text-sm">{{ fmtCurrency(p.amount) }}</span>
              <span :class="['badge', p.status == 1 ? 'badge-success' : 'badge-warning']">
                {{ p.status == 1 ? 'Paid' : 'Pending' }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="chart-empty">No payment records</div>
      </div>

      <!-- Recent Contacts -->
      <div class="recent-card">
        <div class="card-hd">
          <h3><i class="fa-solid fa-envelope mr-2 text-indigo-400"></i>Recent Contacts</h3>
          <NuxtLink to="/admin-panel/contacts" class="view-all">View all →</NuxtLink>
        </div>
        <div v-if="isLoading" class="space-y-2">
          <div v-for="i in 5" :key="i" class="flex gap-3 items-center">
            <Skeleton width="2.5rem" height="2.5rem" shape="circle" />
            <div class="flex-1 space-y-1"><Skeleton width="55%" height="0.8rem" /><Skeleton width="35%" height="0.7rem" /></div>
          </div>
        </div>
        <div v-else-if="contacts.length">
          <div v-for="c in contacts" :key="c.id" class="tbl-row">
            <div class="tbl-avatar tbl-avatar--indigo">{{ (c.first_name?.[0] ?? '?').toUpperCase() }}</div>
            <div class="tbl-info">
              <p class="tbl-name">{{ c.first_name }} {{ c.last_name }}</p>
              <p class="tbl-meta truncate max-w-[160px]">{{ c.subject ?? c.email }}</p>
            </div>
          </div>
        </div>
        <div v-else class="chart-empty">No contacts yet</div>
      </div>
    </div>

    <!-- ══ Quick Actions ════════════════════════════════════════════════════ -->
    <div class="qa-section">
      <p class="qa-heading">Quick Actions</p>
      <div class="qa-grid">
        <NuxtLink v-for="qa in [
          { to:'/admin-panel/fractional-items',       icon:'fa-layer-group',   label:'Fractional Items', color:'indigo' },
          { to:'/admin-panel/retail-cars',             icon:'fa-car',            label:'Retail Cars',      color:'rose' },
          { to:'/admin-panel/restoration-cars',        icon:'fa-tools',          label:'Restoration',      color:'amber' },
          { to:'/admin-panel/users',                   icon:'fa-users',          label:'Users',            color:'violet' },
          { to:'/admin-panel/bid-list',                icon:'fa-handshake',      label:'Allocations',      color:'teal' },
          { to:'/admin-panel/compliance',              icon:'fa-shield-halved',  label:'KYC',              color:'emerald' },
          { to:'/admin-panel/payment-history',         icon:'fa-wallet',         label:'Payments',         color:'green' },
          { to:'/admin-panel/blog-infos',              icon:'fa-newspaper',      label:'Blog',             color:'pink' },
          { to:'/admin-panel/email-templates',         icon:'fa-envelope',       label:'Emails',           color:'slate' },
          { to:'/admin-panel/subscribes',              icon:'fa-rss',            label:'Subscribers',      color:'orange' },
          { to:'/admin-panel/contacts',                icon:'fa-message',        label:'Contacts',         color:'blue' },
          { to:'/admin-panel/news',                    icon:'fa-satellite-dish', label:'News',             color:'cyan' },
        ]" :key="qa.to" :to="qa.to" :class="`qa-btn qa-btn--${qa.color}`">
          <i :class="`fa-solid ${qa.icon} text-lg`"></i>
          <span>{{ qa.label }}</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
// ── Root ─────────────────────────────────────────────────────────────────────
.db-root {
  @apply max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7;
}

// ── Header ───────────────────────────────────────────────────────────────────
.db-header   { @apply flex flex-wrap items-start justify-between gap-4; }
.db-eyebrow  { @apply text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-0.5; }
.db-title    { @apply text-3xl font-bold text-gray-900 dark:text-white; }
.db-sub      { @apply text-xs text-gray-400 mt-1; }
.db-refresh  {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
         bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
         text-gray-700 dark:text-gray-200
         hover:bg-gray-50 dark:hover:bg-gray-700
         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150;
  .spin { animation: spin 0.8s linear infinite; }
}
@keyframes spin { to { transform: rotate(360deg); } }

// ── KPI Strip ────────────────────────────────────────────────────────────────
.kpi-strip {
  @apply grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3;
}
.kpi-card {
  @apply flex flex-col gap-2 p-4 rounded-2xl border border-transparent
         bg-white dark:bg-gray-800/80 shadow-sm
         hover:shadow-md hover:-translate-y-0.5 transition-all duration-200;
  .kpi-ico { @apply w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0; }
  .kpi-lbl { @apply text-[10px] font-semibold uppercase tracking-wider text-gray-400; }
  .kpi-val { @apply text-2xl font-bold text-gray-900 dark:text-white leading-tight; }
  .kpi-sub { @apply text-[10px] text-gray-400 truncate; }

  &.kpi-indigo .kpi-ico { @apply bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400; }
  &.kpi-rose .kpi-ico   { @apply bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400; }
  &.kpi-emerald .kpi-ico{ @apply bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400; }
  &.kpi-amber .kpi-ico  { @apply bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400; }
  &.kpi-violet .kpi-ico { @apply bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400; }
  &.kpi-teal .kpi-ico   { @apply bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400; }
  &.kpi-orange .kpi-ico { @apply bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400; }
  &.kpi-pink .kpi-ico   { @apply bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400; }
}

// ── Layout grids ──────────────────────────────────────────────────────────────
.row-2-1 { @apply grid grid-cols-1 lg:grid-cols-3 gap-5; }
.row-3   { @apply grid grid-cols-1 lg:grid-cols-3 gap-5; }
.row-4   { @apply grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5; }
.span-2  { @apply lg:col-span-2; }

// ── Chart cards ───────────────────────────────────────────────────────────────
.chart-card {
  @apply bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60
         shadow-sm p-5 flex flex-col;
}
.card-hd {
  @apply flex flex-wrap items-center justify-between gap-2 mb-4;
  h3 { @apply text-sm font-semibold text-gray-700 dark:text-gray-200; }
}
.card-hd-badge { @apply flex gap-2; }

.chart-skeleton { }
.chart-empty {
  @apply flex items-center justify-center h-[120px] text-xs text-gray-400 dark:text-gray-600 text-center;
}

// ── Stat pills ────────────────────────────────────────────────────────────────
.stat-pill {
  @apply rounded-xl p-3 flex flex-col items-center justify-center;
  .stat-pill-val { @apply text-xl font-bold; }
  .stat-pill-lbl { @apply text-[10px] text-gray-400 mt-0.5; }
  &--amber   { @apply bg-amber-50 dark:bg-amber-500/10; .stat-pill-val { @apply text-amber-500; } }
  &--emerald { @apply bg-emerald-50 dark:bg-emerald-500/10; .stat-pill-val { @apply text-emerald-500; } }
  &--indigo  { @apply bg-indigo-50 dark:bg-indigo-500/10; .stat-pill-val { @apply text-indigo-500; } }
  &--violet  { @apply bg-violet-50 dark:bg-violet-500/10; .stat-pill-val { @apply text-violet-500; } }
}

// ── Progress stats ────────────────────────────────────────────────────────────
.progress-stat {
  @apply flex justify-between text-sm mb-2;
  .ps-label { @apply text-gray-500 dark:text-gray-400; }
  .ps-val   { @apply font-semibold text-gray-800 dark:text-white; }
}
.ps-prog-wrap { @apply flex items-center gap-3 mb-1; }
.ps-prog-bar  { @apply flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden; }
.ps-prog-fill {
  @apply h-full rounded-full transition-all duration-700;
  &--teal   { @apply bg-teal-500; }
  &--orange { @apply bg-orange-500; }
}
.ps-prog-pct { @apply text-xs text-gray-400 whitespace-nowrap; }

// ── Content pills ─────────────────────────────────────────────────────────────
.content-pills { @apply flex gap-3 flex-wrap; }
.cp-pill {
  @apply flex flex-col items-center justify-center px-4 py-2 rounded-xl flex-1;
  .cp-val { @apply text-xl font-bold; }
  .cp-lbl { @apply text-[10px] text-gray-400 mt-0.5; }
  &--indigo  { @apply bg-indigo-50 dark:bg-indigo-500/10; .cp-val { @apply text-indigo-500; } }
  &--amber   { @apply bg-amber-50 dark:bg-amber-500/10; .cp-val { @apply text-amber-500; } }
  &--emerald { @apply bg-emerald-50 dark:bg-emerald-500/10; .cp-val { @apply text-emerald-500; } }
}

// ── Engagement strip ─────────────────────────────────────────────────────────
.engage-strip {
  @apply grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4;
}
.engage-card {
  @apply flex flex-col items-center justify-center py-5 rounded-2xl
         border border-transparent
         bg-white dark:bg-gray-800/80 shadow-sm text-center
         hover:shadow-md hover:-translate-y-0.5 transition-all duration-200;
  .engage-val { @apply text-2xl font-bold text-gray-900 dark:text-white; }
  .engage-lbl { @apply text-xs text-gray-400 mt-1; }
  &.engage-pink   i { @apply text-pink-400; }
  &.engage-teal   i { @apply text-teal-400; }
  &.engage-amber  i { @apply text-amber-400; }
  &.engage-indigo i { @apply text-indigo-400; }
  &.engage-violet i { @apply text-violet-400; }
  &.engage-orange i { @apply text-orange-400; }
}

// ── Recent cards ──────────────────────────────────────────────────────────────
.recent-card {
  @apply bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60
         shadow-sm p-5;
}
.view-all { @apply text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors; }

.tbl-row {
  @apply flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700/40 last:border-0;
}
.tbl-avatar {
  @apply w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0;
  &--amber   { @apply bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400; }
  &--emerald { @apply bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400; }
  &--indigo  { @apply bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400; }
}
.tbl-img  { @apply w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0; }
.tbl-info { @apply flex-1 min-w-0; }
.tbl-name { @apply text-sm font-medium text-gray-800 dark:text-gray-200 truncate; }
.tbl-meta { @apply text-xs text-gray-400 truncate; }

// ── Badges ────────────────────────────────────────────────────────────────────
.badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap;
}
.badge-success { @apply bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400; }
.badge-danger  { @apply bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400; }
.badge-warning { @apply bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400; }
.badge-info    { @apply bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400; }
.badge-neutral { @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400; }

// ── Quick actions ─────────────────────────────────────────────────────────────
.qa-section  { }
.qa-heading  { @apply text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4; }
.qa-grid     { @apply grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-3; }
.qa-btn {
  @apply flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-xl
         text-[10px] font-semibold text-center
         transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 cursor-pointer;

  &--indigo  { @apply bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100; }
  &--rose    { @apply bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-100; }
  &--amber   { @apply bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-100; }
  &--violet  { @apply bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-100; }
  &--teal    { @apply bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-100; }
  &--emerald { @apply bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100; }
  &--green   { @apply bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 hover:bg-green-100; }
  &--pink    { @apply bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 hover:bg-pink-100; }
  &--slate   { @apply bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100; }
  &--orange  { @apply bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-100; }
  &--blue    { @apply bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-100; }
  &--cyan    { @apply bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100; }
}
</style>