import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const authForms = document.querySelectorAll('[data-auth-form]');
let supabase;

function showStatus(form, message, isError = false) {
  const status = form.querySelector('[data-auth-status]');
  status.textContent = message;
  status.dataset.state = isError ? 'error' : 'success';
}

if (!supabaseUrl || !supabaseKey) {
  authForms.forEach((form) => {
    showStatus(form, 'Authentication is not configured yet. Add the Supabase environment variables to enable it.', true);
  });
} else {
  supabase = createClient(supabaseUrl, supabaseKey);

  authForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('[type="submit"]');
      const formData = new FormData(form);
      submitButton.disabled = true;
      showStatus(form, 'Please wait...');

      try {
        const mode = form.dataset.authForm;
        let result;

        if (mode === 'signup') {
          result = await supabase.auth.signUp({
            email: formData.get('email'),
            password: formData.get('password'),
            options: {
              data: {
                full_name: formData.get('full_name'),
                preferred_language: formData.get('preferred_language') || 'en',
              },
              emailRedirectTo: `${window.location.origin}/login.html`,
            },
          });
          if (result.error) throw result.error;
          showStatus(form, result.data.session
            ? 'Your account is ready. Redirecting...'
            : 'Account created. Check your email to confirm your address.');
          if (result.data.session) window.location.assign('frontpage.html');
        } else if (mode === 'login') {
          result = await supabase.auth.signInWithPassword({
            email: formData.get('email'),
            password: formData.get('password'),
          });
          if (result.error) throw result.error;
          showStatus(form, 'Signed in. Redirecting...');
          window.location.assign('frontpage.html');
        } else if (mode === 'forgot-password') {
          result = await supabase.auth.resetPasswordForEmail(formData.get('email'), {
            redirectTo: `${window.location.origin}/reset-password.html`,
          });
          if (result.error) throw result.error;
          showStatus(form, 'If an account exists for that email, a password reset link is on its way.');
        } else if (mode === 'reset-password') {
          result = await supabase.auth.updateUser({ password: formData.get('password') });
          if (result.error) throw result.error;
          showStatus(form, 'Password updated. You can now sign in.');
          await supabase.auth.signOut();
          window.setTimeout(() => window.location.assign('login.html'), 1200);
        }
      } catch (error) {
        showStatus(form, error.message || 'Something went wrong. Please try again.', true);
      } finally {
        submitButton.disabled = false;
      }
    });
  });
}