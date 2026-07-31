// We prioritize the localStorage value (for local testing/admin deployments)
// If not found, we fallback to the Vercel injected environment variable.
// If neither exists, we fallback to the hardcoded Preprod address.
export const PREPROD_CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  localStorage.getItem('PREPROD_CONTRACT_ADDRESS') ||
  'b54ec82c83b0ab08aaba7abdede0b9a8eb0e4dbff76413843cb345e4429733d5';

export const MIN_GPA_THRESHOLD = import.meta.env.VITE_MIN_GPA_THRESHOLD ? parseInt(import.meta.env.VITE_MIN_GPA_THRESHOLD, 10) : 800;
export const MAX_INCOME_THRESHOLD = import.meta.env.VITE_MAX_INCOME_THRESHOLD ? parseInt(import.meta.env.VITE_MAX_INCOME_THRESHOLD, 10) : 250000;
