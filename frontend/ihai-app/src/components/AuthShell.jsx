const AuthShell = ({ title = "Create an account", subtitle, children }) => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
        <div className="min-h-[70vh] max-h-[85vh] w-[1100px] grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl bg-white">
          {/* Left side image */}
          <div className="relative hidden md:block">
            <img
              src="../src/assets/images/login-hero.png"
              alt=""
              className="h-full w-full object-cover"
            />
            {/* optional light overlay */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 left-4">
              <a
                href="/"
                className="px-3 py-1 rounded-full text-sm bg-white/80 text-gray-700 hover:bg-white"
              >
                Back to website →
              </a>
            </div>
          </div>
  
          {/* Right side panel */}
          <div className="p-8 md:p-10 text-gray-800">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="mb-6 text-sm text-gray-600">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  export default AuthShell;