// Format date to "DD MMM YYYY"
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Format time ago
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

// Get attendance color
export const getAttendanceColor = (pct) => {
  if (pct >= 75) return '#16A34A';
  if (pct >= 60) return '#D97706';
  return '#DC2626';
};

// Validate Andhra University email — regno@andhrauniversity.edu.in
// Accepts any local part as long as the domain is correct
export const validateAUEmail = (email) => {
  const trimmed = (email || '').trim().toLowerCase();
  const at = trimmed.indexOf('@');
  if (at < 1) return false;
  return trimmed.slice(at + 1) === 'andhrauniversity.edu.in';
};

// Validate password: 6-12 chars, uppercase, lowercase, special
export const validatePassword = (password) => {
  if (password.length < 6 || password.length > 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[!@#$%^&*]/.test(password)) return false;
  return true;
};

// Get today's date as YYYY-MM-DD
export const todayISO = () => {
  return new Date().toISOString().split('T')[0];
};

// Get first name from full name
export const firstName = (name) => {
  if (!name) return '';
  return name.trim().split(' ')[0];
};
