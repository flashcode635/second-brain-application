import { useNavigate } from "react-router-dom";
import image from "../assets/list.jpg";
// Navigation component to handle button and navigation
export const NavigationButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="theme-button-primary font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl" 
      onClick={() => navigate("/signup")}
    >
      Get Started
    </button>
  );
};

export function HomePage() {
  return (
    <div className="theme-page min-h-screen">
     
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Organize Your Digital Life
          </h1>
          <p className="text-xl text-text-secondary mb-10 
          max-w-2xl mx-auto">
            Save, organize, and access your favorite content from across the web in one place.
            Your second brain for the digital age.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button 
              onClick={() => window.location.href = '/signup'}
              className="theme-button-primary font-medium px-8 py-3 rounded-lg text-lg transition-colors duration-200"
            >
              Start for Free
            </button>
            <button 
              onClick={() => window.location.href = '/signin'}
              className="theme-button-secondary shadow-lg font-medium px-8 py-3 rounded-lg text-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </div>

          <div className="theme-surface relative h-64 md:h-80 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-page to-page-deep opacity-10"></div>
            <div className="relative h-full flex items-center justify-center p-0">
              <p className="text-text-secondary text-lg font-medium">
                <img src={image} alt="Your content, organized beautifully" />
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="theme-surface py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="theme-muted-surface p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="theme-surface-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Everything</h3>
              <p className="text-text-secondary">
                Store articles, videos, and resources from any platform with a single click.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="theme-muted-surface p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="theme-surface-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Instantly</h3>
              <p className="text-text-secondary">
                Powerful search helps you find exactly what you need, when you need it.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="theme-muted-surface p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="theme-surface-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
              <p className="text-text-secondary">
                Your content is available on all your devices, anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="theme-muted-surface py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-text-secondary mb-8 
          max-w-2xl mx-auto">
            Join thousands of users who are already organizing their digital lives.
          </p>
          <button 
            onClick={() => window.location.href = '/signup'}
            className="theme-button-primary font-medium px-8 py-3 rounded-lg text-lg transition-colors duration-200"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-text-muted">
          <p> 2024 Second Brain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}