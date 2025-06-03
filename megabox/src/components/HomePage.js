import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#003e4b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">MegaBox</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-[#003e4b]">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Transform Your Storage</span>
              <span className="block text-[#60a5fa]">with MegaBox</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The most secure and efficient way to store and manage your belongings.
            </p>
            <div className="mt-10 flex justify-center space-x-6">
              <a href="https://mega-box.vercel.app/" className="inline-block bg-[#01677e] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#003e4b] hover:border-2 hover:border-white transition duration-300">
                Get Started
              </a>
            </div>
            {/* App Store Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <a href="https://apps.apple.com/sg/app/terabox-1tb-cloud-ai-space/id1509453185?mt=8" className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-300">
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.07-.5-2.04-.48-3.16 0-1.39.68-2.12.53-3.01-.4C3.33 15.85 4.05 8.42 9.15 8.06c1.2-.07 2.08.4 2.85.5.77.1 1.8-.4 3.16-.3 2.03.2 3.56 1.1 4.3 2.7-3.87 2.24-3.23 7.87.6 9.32zm-4.2-16.4c-2.5.16-4.45 2.8-4.2 4.96 2.27.25 4.47-2.5 4.2-4.95z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.dubox.drive" className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition duration-300">
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
                </svg>
                <div>
                  <div className="text-[10px] font-normal">GET IT ON</div>
                  <div className="text-sm font-medium leading-none mt-1">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the sections... */}
      {/* (Premium Features, Features, Contact, Footer sections remain the same) */}
    </div>
  );
}

export default HomePage;
