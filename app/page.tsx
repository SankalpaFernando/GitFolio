'use client'

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, ExternalLink, Code, Zap, Palette, Search, BarChart3, Lock, ChevronDown, Rocket, Layers, Sparkles, ArrowRight, CheckCircle, Users, Globe } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-400" />
            GitFolio
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm">
            <a href="#features" className="text-slate-300 hover:text-blue-400 transition">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-blue-400 transition">How it Works</a>
            <a href="#faqs" className="text-slate-300 hover:text-blue-400 transition">FAQs</a>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Sign In</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 md:py-40 text-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Build Once, Impress Forever</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Create Your Developer <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Portfolio</span> in Seconds
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
            GitFolio turns your GitHub profile into a stunning, professional portfolio website, no coding required.
          </p>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg">
            Showcase your projects, skills, and certifications. Let your work speak for itself.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Button size="lg" className="bg-linear-to-r border-0 from-blue-600 to-purple-600 hover:from-blue-700 hover:cursor-pointer hover:to-purple-700 text-white gap-2 shadow-lg shadow-blue-500/30">
              <Rocket className="w-4 h-4" />
              Build Your Portfolio
            </Button>
            <Button size="lg" variant="outline" className="border-slate-700 bg-slate-700 text-white hover:bg-slate-800/50 hover:cursor-pointer hover:border-slate-800/50 hover:text-blue-400 gap-2">
              View Examples
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Featured Portfolios */}
          <div className="inline-block backdrop-blur-md bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
            <p className="text-sm text-slate-400 mb-6 flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Featured Developer Portfolios
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { name: "Sarah Dev", role: "Full Stack" },
                { name: "John Coder", role: "Backend" },
                { name: "Alex Build", role: "DevOps" }
              ].map((dev, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 px-4 py-2 rounded-full border border-slate-600/30">
                  <p className="text-sm font-semibold text-white">{dev.name}</p>
                  <p className="text-xs text-slate-400">{dev.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Everything You Need to Stand Out</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            GitFolio handles the design and hosting while you focus on building amazing projects.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              description: "Experience blazing-fast portfolio loading speeds optimized for performance.",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: <Palette className="w-8 h-8" />,
              title: "Modern Themes",
              description: "Choose from sleek, professional themes designed by expert designers.",
              color: "from-pink-500 to-rose-500"
            },
            {
              icon: <Code className="w-8 h-8" />,
              title: "GitHub Integrated",
              description: "Auto-sync your GitHub projects and keep your portfolio always up-to-date.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Search className="w-8 h-8" />,
              title: "SEO Optimized",
              description: "Built-in SEO optimization to boost your online visibility and reach.",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Analytics",
              description: "Track visits and engagement with built-in analytics dashboard.",
              color: "from-purple-500 to-indigo-500"
            },
            {
              icon: <Lock className="w-8 h-8" />,
              title: "Secure & Reliable",
              description: "Enterprise-grade security to protect your data and privacy.",
              color: "from-red-500 to-pink-500"
            },
          ].map((feature, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-slate-800/80 to-slate-900/80"></div>
              
              <div className="relative p-8">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 shadow-lg text-white`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="backdrop-blur-sm bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-slate-700/50 rounded-3xl p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">GitFolio in 3 Simple Steps</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line - hidden on mobile */}
            <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0"></div>

            {[
              { num: "01", icon: <Github className="w-6 h-6" />, title: "Sign Up with GitHub", desc: "Effortlessly integrate your GitHub account with one click." },
              { num: "02", icon: <Palette className="w-6 h-6" />, title: "Customize Your Portfolio", desc: "Choose a theme and add your bio, skills, and social links." },
              { num: "03", icon: <Globe className="w-6 h-6" />, title: "Share & Showcase", desc: "Get your live portfolio and share it across all platforms." }
            ].map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/50">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Showcase */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">Showcase Everything That Matters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Projects",
              icon: <Code className="w-6 h-6" />,
              description: "Display your best work with descriptions, technologies used, and live links.",
              items: ["GitHub repositories", "Live project links", "Project descriptions", "Technology stack"],
              color: "from-blue-500/20 to-cyan-500/20"
            },
            {
              title: "Skills & Expertise",
              icon: <Layers className="w-6 h-6" />,
              description: "Highlight the tools and technologies you master.",
              items: ["Programming languages", "Frameworks & libraries", "Databases", "DevOps & Tools"],
              color: "from-purple-500/20 to-pink-500/20"
            },
            {
              title: "Certifications",
              icon: <CheckCircle className="w-6 h-6" />,
              description: "Showcase your credentials and professional achievements.",
              items: ["Course certifications", "Professional badges", "Awards", "Recognition"],
              color: "from-green-500/20 to-emerald-500/20"
            },
            {
              title: "Social & Contact",
              icon: <Users className="w-6 h-6" />,
              description: "Make it easy for opportunities to find and connect with you.",
              items: ["GitHub profile", "LinkedIn", "Twitter/X", "Email & Website"],
              color: "from-orange-500/20 to-red-500/20"
            },
          ].map((section, index) => (
            <div key={index} className={`relative overflow-hidden rounded-2xl border border-slate-700/50 backdrop-blur-sm bg-gradient-to-br ${section.color} p-8 hover:border-slate-600/80 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${section.title === "Projects" ? "from-blue-500 to-cyan-500" : section.title === "Skills & Expertise" ? "from-purple-500 to-pink-500" : section.title === "Certifications" ? "from-green-500 to-emerald-500" : "from-orange-500 to-red-500"} text-white shadow-lg`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">{section.title}</h3>
                  <p className="text-slate-400 text-sm">{section.description}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Developers Love GitFolio</h2>
          <p className="text-slate-400 text-lg">Join hundreds of developers transforming their careers</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Alex Chen",
              role: "Full Stack Developer",
              text: "GitFolio made creating my portfolio so simple. Within minutes, I had a professional website showcasing all my projects!",
              avatar: "AC",
              color: "from-blue-500 to-cyan-500"
            },
            {
              name: "Sarah Williams",
              role: "Frontend Engineer @ TechCorp",
              text: "The GitHub integration is a game-changer. My portfolio automatically updates when I push new projects. Brilliant!",
              avatar: "SW",
              color: "from-purple-500 to-pink-500"
            },
            {
              name: "Mike Johnson",
              role: "DevOps Engineer",
              text: "As someone who'd rather code than design, GitFolio is perfect. I got more interview callbacks after setting this up.",
              avatar: "MJ",
              color: "from-orange-500 to-red-500"
            },
          ].map((testimonial, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl border border-slate-700/50 backdrop-blur-sm bg-slate-800/30 p-8 hover:border-slate-600/80 hover:shadow-xl hover:shadow-slate-900/30 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
              
              <div className="relative">
                <p className="text-slate-300 mb-6 italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="max-w-4xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Common Questions</h2>
          <p className="text-slate-400 text-lg">Everything you need to know about GitFolio</p>
        </div>
        
        <div className="space-y-4">
          {[
            {
              q: "Can I customize my portfolio after creating it?",
              a: "Yes! GitFolio allows you to customize your portfolio anytime. Change themes, update your bio, add new projects, and more with just a few clicks."
            },
            {
              q: "How does the GitHub integration work?",
              a: "When you sign up with GitHub, GitFolio automatically imports your public repositories and profile information. You can select which projects to showcase on your portfolio."
            },
            {
              q: "Is my data secure?",
              a: "Absolutely. GitFolio uses enterprise-grade security measures to protect your data. We never store your GitHub credentials and follow the highest security standards."
            },
            {
              q: "Can I use my own domain?",
              a: "Coming soon! We're currently developing custom domain support. For now, your portfolio will be hosted on a GitFolio subdomain at no cost."
            },
            {
              q: "What if I don't have many projects on GitHub?",
              a: "No problem! You can manually add projects, links, and descriptions to your portfolio. GitFolio also lets you add certifications, skills, and contact information."
            },
            {
              q: "Is there customer support available?",
              a: "Yes! Our support team is here to help. You can reach us at support@gitfolio.io or through our in-app help center."
            },
          ].map((faq, index) => (
            <button
              key={index}
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className="w-full text-left rounded-xl border border-slate-700/50 backdrop-blur-sm bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/80 transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 p-6">
                <h3 className="font-semibold text-white">{faq.q}</h3>
                <ChevronDown className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`} />
              </div>
              {expandedFaq === index && (
                <div className="px-6 pb-6 pt-0 border-t border-slate-700/30">
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
        <div className="relative">
          {/* Background gradient blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-3xl"></div>
          
          <div className="relative backdrop-blur-sm bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Showcase Your Work?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of developers who&apos;ve already built stunning portfolios with GitFolio. It takes less than 5 minutes and costs nothing to get started.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:cursor-pointer text-white gap-2 shadow-lg shadow-blue-500/30">
                <Rocket className="w-4 h-4" />
                Create Your Portfolio Now
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 bg-slate-700 text-white hover:border-slate-800/50 hover:cursor-pointer hover:bg-slate-800/50 hover:text-blue-400">
                View Live Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
   
    </div>
  )
}
