
// Initialize theme based on user's preference or system settings
export function initializeTheme() {
  // Check if theme preference is stored in localStorage
  const storedTheme = localStorage.getItem('theme');
  
  // Apply theme based on stored preference or system preference
  if (storedTheme === 'dark' || 
      (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
