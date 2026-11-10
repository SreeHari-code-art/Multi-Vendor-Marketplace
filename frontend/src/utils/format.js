// Change the currency here and it updates everywhere.
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const formatPrice = (n) => money.format(n ?? 0);
export const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';
export const homeFor = (role) => (role === 'seller' ? '/seller' : role === 'admin' ? '/admin' : '/');
export const ORDER_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered'];
