import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">Terms of <span className="text-primary italic font-serif lowercase">Service</span></h1>
        
        <div className="prose prose-slate max-w-none space-y-8 font-medium text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">1. Agreement to Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, then you are prohibited from using the site and must discontinue use immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">2. Intellectual Property Rights</h2>
            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">3. User Representations</h2>
            <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">4. Prohibited Activities</h2>
            <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">5. Delivery Policy</h2>
            <p>We aim to deliver all organic products within 24 hours of harvest. However, delivery times are estimates and may vary based on location and weather conditions.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
