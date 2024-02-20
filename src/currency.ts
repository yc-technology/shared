export const getCurrencySymbol = (currency = '') => {
  const c = currency.toUpperCase()
  const currencySymbol: { [key: string]: string } = {
    USD: '$',
    CNY: '¥',
    EUR: '€',
    GBP: '£',
    HKD: 'HK$',
    JPY: '¥',
    KRW: '₩',
    TWD: 'NT$'
  }
  return currencySymbol[c] || currency
}
