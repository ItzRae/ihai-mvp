const AuthShell = ({ title = "Create an account", subtitle, children }) => {
    return (
      <div className="min-h-dvh flex items-center justify-center py-8 px-4 overflow-auto
        bg-[radial-gradient(circle_at_top_left,rgba(var(--primary-dark-blue),0.4),rgba(var(--primary-teal),0.25),white)]">
  
        {/* Card */}
        <div className="
          w-full max-w-[1100px]
          grid md:grid-cols-2
          rounded-2xl shadow-lg bg-white
          md:h-[85dvh]      /* make both sides share a fixed height on md+ */
          overflow-hidden   /* clip the image to the rounded card */
        ">
  
          {/* Left: image */}
          <div className="relative hidden md:block h-full min-h-0">
            <img
              src="../src/assets/images/login-hero.png"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 left-4">
              <a
                href="/"
                className="px-3 py-1 rounded-full text-sm bg-white/80 text-gray-700 hover:bg-white"
              >
                Back to website →
              </a>
            </div>
            <div className="absolute top-4 right-2">
              <img
                src="../src/assets/images/ihai-logo-byline-color.png"
                alt="IHAI logo"
                className="h-16 w-auto"
              />
            </div>
          </div>
  
          {/* Right: scrolls within the fixed card height */}
          <div className="
            p-6 sm:p-8 md:p-10 text-gray-800
            h-full min-h-0 overflow-y-auto
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