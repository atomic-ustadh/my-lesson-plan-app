import { supabase } from '../supabaseClient';

const Auth = () => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // You can add a redirectTo option here if you want to redirect
          // users to a specific page after they sign in.
          // redirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error.message);
      // You could display this error to the user in a more friendly way.
      alert('Failed to sign in with Google: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to the Lesson Planner
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue
          </p>
        </div>
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5 mr-2 -ml-1"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73.2 0 136 25.3 186.3 65.8l-67.4 64.9C331.7 101.3 291.4 80 244 80 149.3 80 72 155.1 72 256s77.3 176 172 176c56.8 0 96.2-22.1 123.3-47.8 20.3-19.1 33.6-43.2 37.9-71.1H244V261.8h244z"
            ></path>
          </svg>
          Sign in with Google Account
        </button>
        <p className="text-xs text-center text-gray-500">
          By signing in, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default Auth;