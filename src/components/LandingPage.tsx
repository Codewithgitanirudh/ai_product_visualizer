import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Image as ImageIcon, Zap, Palette, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate stunning product visualizations in seconds with AI-powered technology"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Creative Control",
      description: "Edit and customize your images with simple text prompts"
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Multiple Variations",
      description: "Get multiple marketing-ready variations of your product images"
    }
  ];

  const benefits = [
    "No design skills required",
    "Instant professional results",
    "Multiple style variations",
    "Easy image editing with AI"
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-white to-base-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-base-400/50 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-linear-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-xl shadow-md">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-content-100">AI Product Visualizer</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center gap-2 px-6 py-2 bg-linear-to-r from-brand-primary to-brand-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Heading */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-base-400/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-content-200">Powered by AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-content-100 mb-6 leading-tight">
            Transform Your Products Into
            <span className="block bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Marketing Magic
            </span>
          </h1>

          <p className="text-lg md:text-xl text-content-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create stunning, professional product visualizations in seconds. No design experience needed. 
            Just upload, generate, and watch your products come to life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="group w-full sm:w-auto px-8 py-4 bg-linear-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-base-200 text-content-100 font-semibold rounded-xl border-2 border-base-400 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Learn More
            </button>
          </div>

          {/* Benefits List */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-base-400/50 shadow-sm"
              >
                <Check className="w-4 h-4 text-brand-primary" />
                <span className="text-sm font-medium text-content-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-6xl mx-auto mt-20 md:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-content-100 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-content-200 max-w-2xl mx-auto">
              Powerful features designed to make product visualization effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-base-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-linear-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-content-100 mb-2">{feature.title}</h3>
                <p className="text-content-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="max-w-4xl mx-auto mt-20 md:mt-32 mb-12">
          <div className="bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-accent/10 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-base-400/50 shadow-xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-content-100 mb-4">
              Ready to Transform Your Products?
            </h2>
            <p className="text-lg text-content-200 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using AI to bring their products to life
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-10 py-5 bg-linear-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-accent text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 mx-auto"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-base-400/50 backdrop-blur-sm bg-white/80 mt-20">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-linear-to-br from-brand-primary via-brand-secondary to-brand-accent rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm text-content-300">© 2024 AI Product Visualizer</span>
            </div>
            <p className="text-sm text-content-300">
              Powered by advanced AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

