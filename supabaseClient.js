// Simple authentication without Supabase for local development
// This bypasses all server requirements

// Simple local authentication - no server required
const users = JSON.parse(localStorage.getItem('localUsers') || '[]');

function getSupabase() {
  return {
    auth: {
      signInWithPassword: async ({ email, password }) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          return { data: { user: { id: user.id, email: user.email } }, error: null };
        }
        return { data: null, error: { message: 'Invalid credentials' } };
      },
      signUp: async ({ email, password }) => {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          return { data: null, error: { message: 'User already exists' } };
        }
        const newUser = { id: Date.now(), email, password };
        users.push(newUser);
        localStorage.setItem('localUsers', JSON.stringify(users));
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        return { error: null };
      },
      getSession: async () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        return { data: { session: isLoggedIn ? { user: { id: 1 } } : null } };
      },
      getUser: async () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        return { data: { user: isLoggedIn ? { id: 1 } : null } };
      },
      onAuthStateChange: (callback) => {
        // Simple implementation
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    }
  };
}

// --------- Convenience Auth Helpers ---------

/**
 * Sign in with email/password.
 */
async function signInWithPassword(email, password) {
  const supabase = getSupabase();
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email/password.
 */
async function signUpWithPassword(email, password, metadata = {}) {
  const supabase = getSupabase();
  return await supabase.auth.signUp({ email, password, options: { data: metadata } });
}

/**
 * Sign out current user.
 */
async function signOut() {
  const supabase = getSupabase();
  return await supabase.auth.signOut();
}

/**
 * Get current session (if any).
 */
async function getSession() {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get current user (if any).
 */
async function getUser() {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Listen for auth state changes.
 */
async function onAuthStateChange(callback) {
  const supabase = getSupabase();
  return supabase.auth.onAuthStateChange((_event, session) => callback(session));
}

// Also expose helpers on window for use from non-module scripts
window.supabaseHelpers = {
  getSupabase,
  signInWithPassword,
  signUpWithPassword,
  signOut,
  getSession,
  getUser,
  onAuthStateChange
};


