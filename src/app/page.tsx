"use client";
import Image from "next/image";
import { useUser, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // Redirect to dashboard if signed in
        router.replace("/dashboard/files");
      } else {
        // Only show content if not signed in
        setShowContent(true);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  const handleGetStarted = () => {
    setShowSignIn(true);
  };

  // Show loading state while checking auth
  if (!isLoaded || !showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (showSignIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700">
        <SignIn routing="hash" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-teal-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 md:pt-32 md:pb-48">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 -z-10" />
              
              {/* Logo container - larger and borderless */}
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <Image 
                  src="/01.png" 
                  alt="FileDrive" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Secure Cloud Storage for <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Modern Teams</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Store, share, and collaborate on your files from anywhere. Enterprise-grade security meets intuitive design.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔒',
              title: 'Bank-grade Security',
              description: 'End-to-end encryption and enterprise-grade security measures to keep your data safe.'
            },
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Upload and access your files instantly with our high-performance infrastructure.'
            },
            {
              icon: '🤝',
              title: 'Seamless Collaboration',
              description: 'Share files and collaborate with your team in real-time.'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>


    </main>
  );
}