export type ProfileSection = 'profile' | 'allocations' | 'transactions' | 'security'

export type ProfileNavItem = {
  id: ProfileSection
  label: string
  icon: string
  to: string
}

export type ProfileSummary = {
  name: string
  initials: string
  email: string
  completion: number
}

export type ProfileAllocation = {
  title: string
  slots: string
  code: string
  value: string
  paymentStatus: string
  paymentTone: 'success' | 'warning'
  verification: string
  verificationTone: 'success' | 'warning'
  image: string
  action: string
  actionRoute: string
}

export type ProfileTransaction = {
  id: string
  allocationDetails: string
  vehicle: string
  carName: string
  collection: string
  referenceId: string
  price: string
  totalInvestment: number
  allocations: number
  allocationState: string
  allocationTone: 'success' | 'warning'
  paymentStatus: string
  paymentTone: 'success' | 'pending'
  paymentMethod: string
  signedDate: string
  dueDate: string
  image: string
  description: string
  nextAction: string
  supportEmail: string
}

export type ProfileBankDetail = {
  label: string
  value: string
  note?: string
}

const profileSummary: ProfileSummary = {
  name: 'Nayab Navib Navib',
  initials: 'NN',
  email: 'navib@orangebd.com',
  completion: 100
}

const navItems: ProfileNavItem[] = [
  { id: 'profile', label: 'Profile Information', icon: 'pi-user', to: '/profile' },
  // { id: 'allocations', label: 'My Allocations', icon: 'pi-briefcase', to: '/profile/allocations' },
  { id: 'transactions', label: 'Transaction Details', icon: 'pi-receipt', to: '/profile/transactions' },
  { id: 'security', label: 'Change Password', icon: 'pi-lock', to: '/profile/security' }
]

const allocations: ProfileAllocation[] = [
  {
    title: 'Ferrari 365 GTB/4 Daytona',
    slots: '1 Syndicate Slot',
    code: 'TCC-DAYTONA-09',
    value: 'GBP 8,500.00',
    paymentStatus: 'Funded',
    paymentTone: 'success',
    verification: 'Docs Signed',
    verificationTone: 'success',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    action: 'Details',
    actionRoute: '/my-assets'
  },
  {
    title: 'Aston Martin V8 Vantage',
    slots: '1 Syndicate Slot',
    code: 'TCC-ASTON-12',
    value: 'GBP 4,000.00',
    paymentStatus: 'Awaiting Bank Transfer',
    paymentTone: 'warning',
    verification: 'Signature Pending',
    verificationTone: 'warning',
    image: '/frontend/assets/images/AstonMartin.jpg',
    action: 'Complete Checkout',
    actionRoute: '/profile/transactions/NN93366393/payment-details'
  }
]

const transactions: ProfileTransaction[] = [
  {
    id: 'NN93366393',
    allocationDetails: '1 allocation of the Diablo VT Roadster Lamborghini',
    vehicle: 'Diablo VT Roadster Lamborghini',
    carName: 'Diablo VT Roadster Lamborghini',
    collection: 'Modern Classics Collection',
    referenceId: 'NN93366393',
    price: 'GBP 5,000.00',
    totalInvestment: 5000,
    allocations: 1,
    allocationState: 'Awaiting Funding',
    allocationTone: 'warning',
    paymentStatus: 'Pending',
    paymentTone: 'pending',
    paymentMethod: 'Bank Transfer',
    signedDate: '24 Jul 2026, 16:48',
    dueDate: 'Within 5 working days',
    image: '/generated/porsche-studio.png',
    description: 'A rare open-top V12 icon that combines extreme 1990s presence with landmark brand significance and growing collector appeal.',
    nextAction: 'Send bank transfer using reference NN93366393',
    supportEmail: 'support@thecarcrowd.co.uk'
  },
  {
    id: 'NN86885242',
    allocationDetails: '1 allocation of the SLS Mercedes',
    vehicle: 'SLS Mercedes',
    carName: 'SLS Mercedes',
    collection: 'Private Portfolio',
    referenceId: 'NN86885242',
    price: 'GBP 5,000.00',
    totalInvestment: 5000,
    allocations: 1,
    allocationState: 'Funded',
    allocationTone: 'success',
    paymentStatus: 'Funded',
    paymentTone: 'success',
    paymentMethod: 'Bank Transfer',
    signedDate: '12 Mar 2026, 23:11',
    dueDate: 'Completed',
    image: '/generated/hero-aston-studio.png',
    description: 'AMG’s first fully in-house model and the final naturally aspirated V8 supercar from the marque, underpinned by iconic gullwing doors and increasing long-term collectability.',
    nextAction: 'Documents and payment records are available',
    supportEmail: 'support@thecarcrowd.co.uk'
  }
]

const bankDetails: ProfileBankDetail[] = [
  { label: 'Account Name', value: 'THECARCROWD LIMITED', note: 'Please use CAPITAL LETTERS' },
  { label: 'Bank Name', value: 'Revolut' },
  { label: 'Sort Code', value: '23-01-20' },
  { label: 'Account Number', value: '26640209' }
]

export const useProfileDashboard = () => {
  const getTransactionById = (id: string) => {
    const normalizedId = id.toLowerCase()

    return transactions.find((transaction) => transaction.id.toLowerCase() === normalizedId) || transactions[0]
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(value)

  return {
    profileSummary,
    navItems,
    allocations,
    transactions,
    bankDetails,
    getTransactionById,
    formatCurrency
  }
}
