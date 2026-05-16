import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">Privacy <span className="text-primary italic font-serif lowercase">Policy</span></h1>
        
        <div className="prose prose-slate max-w-none space-y-8 font-medium text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">1. Introduction</h2>
            <p>Welcome to Farmers Factory. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">2. Information We Collect</h2>
            <p>We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">3. How We Use Your Information</h2>
            <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">4. Sharing Your Information</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">5. Your Privacy Rights</h2>
            <p>In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
