const AuthShell = ({ title = "Create an account", subtitle, children }) => {
    return (
      // Let the PAGE scroll; use dvh to avoid mobile 100vh bugs
      <div className="min-h-dvh bg-gray-100 flex items-center justify-center py-8 px-4 overflow-auto">
        {/* Card: no global overflow-hidden; responsive width */}
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 rounded-2xl shadow-xl bg-white">
  
          {/* Left: image (hidden on small) */}
          <div className="relative hidden md:block">
            <img
              src="../src/assets/images/login-hero.png"
              alt=""
              className="h-full w-full object-cover rounded-l-2xl"
            />
            <div className="absolute inset-0 bg-black/10 rounded-l-2xl" />
            <div className="absolute top-4 left-4">
              <a
                href="/"
                className="px-3 py-1 rounded-full text-sm bg-white/80 text-gray-700 hover:bg-white"
              >
                Back to website →
              </a>
            </div>

            {/* IHAI logo far right corner */}
            <div className="absolute top-4 right-2">
              <img src="../src/assets/images/ihai-logo-byline-color.png" alt="IHAI logo" className="h-16 w-auto" />
            </div>

          </div>
  
          {/* Right: make THIS panel scroll when content is long on tall screens */}
          <div className="
              p-6 sm:p-8 md:p-10 text-gray-800
              max-h-[85dvh] md:max-h-[90dvh] overflow-y-auto
              rounded-2xl md:rounded-l-none
            ">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="mb-6 text-sm text-gray-600">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  export default AuthShell;