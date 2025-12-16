import React from 'react';

const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
      <h2>1. Introduction</h2>
      <p>
        Welcome to the Ontario Educational Research Consortium (OERC) Privacy Policy. We are committed to protecting your privacy and personal information. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect personal information that you voluntarily provide to us when you register for membership, subscribe to our newsletter, attend events, or contact us. This information may include:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Institutional affiliation</li>
        <li>Job title/role</li>
        <li>Payment information (processed by third-party services like Stripe)</li>
      </ul>
      <p>We also automatically collect certain information when you visit our website, such as your IP address, browser type, operating system, and browsing activity, using cookies and similar tracking technologies.</p>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect for various purposes, including:</p>
      <ul>
        <li>To provide and manage your membership and services</li>
        <li>To send you newsletters, updates, and promotional communications</li>
        <li>To improve our website and services</li>
        <li>To process transactions</li>
        <li>To respond to your inquiries and offer support</li>
        <li>To analyze website usage and trends</li>
      </ul>

      <h2>4. Disclosure of Your Information</h2>
      <p>We may share your information with third-party service providers who perform services on our behalf (e.g., payment processing, email delivery, website hosting). These third parties are obligated to protect your information and use it only for the purposes for which it was disclosed.</p>
      <p>We may also disclose your information if required by law or in response to valid legal requests.</p>

      <h2>5. Data Security</h2>
      <p>We implement reasonable technical and organizational measures designed to protect the security of your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>

      <h2>6. Your Privacy Rights</h2>
      <p>Depending on your jurisdiction, you may have rights regarding your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us using the information below.</p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>

      <h2>8. Contact Us</h2>
      <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
      <p>Email: contact@oerc.ca</p>
    </div>
  );
};

export default PrivacyPolicyContent;
