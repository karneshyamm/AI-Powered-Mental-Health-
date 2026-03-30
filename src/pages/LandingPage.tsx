import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Shield, Sparkles, MessageCircle, BarChart2, BookOpen } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Heart className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Serenity AI</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">How it Works</a>
          <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Features</a>
          <Link to="/login" className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Your 24/7 AI Wellness Companion</span>
            </div>
            <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Nurture Your Mind with <span className="text-emerald-600">Serenity</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              A safe, non-judgmental space to explore your emotions, track your mood, and learn evidence-based coping strategies. Designed to grow with you.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95">
                Get Started Free
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Decorative Shapes */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Abstract Shape Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full -ml-12 -mb-12"></div>
              
              <img 
                src="https://picsum.photos/seed/wellness/800/600" 
                alt="Mental Health Support" 
                className="relative z-10 rounded-2xl shadow-lg w-full object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
              
              <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <MessageCircle className="text-emerald-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">AI Chat</p>
                    <p className="text-[10px] text-gray-500">Always here</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <BarChart2 className="text-teal-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Analytics</p>
                    <p className="text-[10px] text-gray-500">Track progress</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* More Information Section: How it Works */}
        <section id="how-it-works" className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How Serenity Supports You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform combines artificial intelligence with proven psychological techniques to provide a holistic approach to mental wellness.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Daily Check-in", desc: "Start your day by logging your mood and thoughts in your private journal." },
              { step: "02", title: "AI Conversation", desc: "Chat with Serenity whenever you feel overwhelmed or just need to talk." },
              { step: "03", title: "CBT Exercises", desc: "Engage in thought reframing and mindfulness exercises tailored to your state." },
              { step: "04", title: "Progress Review", desc: "Visualize your emotional journey with detailed weekly analytics and insights." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-7xl font-black text-emerald-50 opacity-50 absolute -top-10 -left-4 group-hover:text-emerald-100 transition-colors">{item.step}</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shapes and People Section */}
        <section className="mt-40 bg-emerald-900 rounded-[3rem] p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full -mr-48 -mt-48 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full -ml-32 -mb-32 opacity-50"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Built for Every Individual</h2>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                Whether you're dealing with daily stress, anxiety, or just need a space to reflect, Serenity adapts to your unique needs. We believe mental health is a journey, not a destination.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Personalized CBT interventions</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Privacy-first data encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>24/7 availability, no appointments needed</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* People with Shapes */}
              <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <img src="https://picsum.photos/seed/person1/400/400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-emerald-600/20 mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white/50 rounded-full animate-pulse"></div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group mt-8">
                <img src="https://picsum.photos/seed/person2/400/400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-teal-600/20 mix-blend-overlay"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/50 rotate-45"></div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group -mt-8">
                <img src="https://picsum.photos/seed/person3/400/400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-lg rotate-12"></div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden group">
                <img src="https://picsum.photos/seed/person4/400/400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-teal-500/20 mix-blend-overlay"></div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Preview Section */}
        <section className="mt-40">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl shadow-2xl border border-emerald-50 overflow-hidden max-w-md mx-auto">
                <div className="bg-emerald-600 p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white w-5 h-5" />
                  </div>
                  <span className="text-white font-bold">Serenity AI</span>
                </div>
                <div className="p-6 space-y-4 bg-gray-50">
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                      <p className="text-sm text-gray-800">Hi there! I noticed you haven't checked in today. How are you feeling?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 p-4 rounded-2xl rounded-tr-none shadow-md max-w-[85%]">
                      <p className="text-sm text-white">I'm feeling a bit overwhelmed with work today. It's hard to focus.</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                      <p className="text-sm text-gray-800">I hear you. Work stress can be tough. Let's try a quick 2-minute grounding exercise together. Would that help?</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                  <div className="flex-1 h-10 bg-gray-50 rounded-xl border border-gray-100"></div>
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl"></div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Real Conversations, Real Support</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience a companion that truly listens. Serenity uses advanced AI to understand your emotions and provide helpful, evidence-based responses in real-time.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 font-bold">01</div>
                  <p className="text-gray-700 font-medium">Empathetic listening without judgment</p>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 font-bold">02</div>
                  <p className="text-gray-700 font-medium">Personalized coping strategies for stress</p>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 font-bold">03</div>
                  <p className="text-gray-700 font-medium">24/7 availability for whenever you need to talk</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Voices of Serenity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real stories from people who have found peace and support through our AI companion.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-4">
            {[
              { 
                name: "Sarah J.", 
                role: "Student", 
                quote: "I used to feel so alone with my anxiety at 2 AM. Now, I just open Serenity and it helps me breathe through the panic. It's like having a therapist in my pocket.",
                avatar: "https://picsum.photos/seed/sarah/100/100"
              },
              { 
                name: "Mark T.", 
                role: "Software Engineer", 
                quote: "The mood tracking opened my eyes to how much sleep affects my stress levels. The AI's insights are surprisingly deep and actually helpful for my daily routine.",
                avatar: "https://picsum.photos/seed/mark/100/100"
              },
              { 
                name: "Elena R.", 
                role: "New Parent", 
                quote: "Journaling was always a chore, but the AI summaries make it rewarding. Seeing my progress visualized gives me the motivation to keep going on tough days.",
                avatar: "https://picsum.photos/seed/elena/100/100"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-50/50 relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-serif">"</div>
                <p className="text-gray-600 italic mb-8 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-emerald-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quotes Section */}
        <section className="mt-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-4xl font-serif italic text-gray-700 mb-8 leading-tight">
              "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity."
            </p>
            <div className="w-16 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mt-40 grid md:grid-cols-3 gap-8">
          {[
            { icon: <MessageCircle className="w-8 h-8 text-emerald-500" />, title: "AI Companion", desc: "Empathetic conversations powered by advanced AI to help you navigate your feelings." },
            { icon: <BarChart2 className="w-8 h-8 text-teal-500" />, title: "Mood Analytics", desc: "Track your emotional patterns over time with intuitive visual dashboards." },
            { icon: <BookOpen className="w-8 h-8 text-emerald-500" />, title: "CBT Tools", desc: "Evidence-based exercises to help reframe negative thoughts and build resilience." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-white rounded-[2.5rem] shadow-xl shadow-emerald-50 border border-emerald-50/50"
            >
              <div className="mb-6 w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="mt-40 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is my data private?", a: "Yes, we use industry-standard encryption and never share your personal journal entries or chat history with third parties." },
              { q: "How does the AI work?", a: "Serenity uses advanced natural language processing trained on evidence-based psychological frameworks like CBT and mindfulness." },
              { q: "Can I use it for emergencies?", a: "Serenity is a support tool, not a crisis service. We provide emergency resources, but please contact professional services in a crisis." }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="mt-40 mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[3rem] p-16 text-center text-white shadow-2xl shadow-emerald-200 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full -mr-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-extrabold mb-6 leading-tight">Ready to Start Your <br/>Journey to Peace?</h2>
              <p className="text-emerald-50 text-xl mb-10 max-w-2xl mx-auto opacity-90">
                Join thousands of others who are prioritizing their mental wellness with Serenity AI. Your first step towards a calmer mind starts here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all shadow-xl active:scale-95">
                  Get Started for Free
                </Link>
                <Link to="/login" className="px-10 py-5 bg-emerald-700/30 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-xl hover:bg-emerald-700/50 transition-all active:scale-95">
                  Sign In
                </Link>
              </div>
              <p className="mt-8 text-emerald-200 text-sm font-medium">No credit card required. Cancel anytime.</p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-2xl text-white tracking-tight">Serenity AI</span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed text-lg mb-8">
                Empowering individuals to take control of their mental wellness through accessible, intelligent, and compassionate technology.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-8">Product</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">CBT Exercises</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Companion</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-8">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">© 2026 Serenity AI. Built with care for your mind.</p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Secure Data</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Made with Love</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

