import React from 'react';

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Certum AI',
    url: 'https://certumai.xyz',
    description: 'AI-powered interview preparation and job search platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://certumai.xyz/app?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Certum AI',
    url: 'https://certumai.xyz',
    logo: 'https://certumai.xyz/logo.png',
    description: 'AI-powered interview preparation platform helping professionals land their dream jobs',
    sameAs: [
      // Add your social media profiles when available
      // 'https://twitter.com/certumai',
      // 'https://linkedin.com/company/certumai',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Certum AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      priceValidUntil: '2025-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10000',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Master your next job interview with AI-powered preparation. Practice realistic mock interviews, optimize your resume, and analyze job descriptions.',
    featureList: [
      'AI Interview Practice',
      'Resume Optimization',
      'Job Description Analysis',
      'Real-time Feedback',
      'Personalized Coaching',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does AI interview practice work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Certum AI uses advanced AI to conduct realistic mock interviews tailored to your target role. You have real-time voice conversations with the AI interviewer, receive personalized questions based on job requirements, and get instant feedback on your communication clarity and confidence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can Certum AI help with resume optimization?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Upload your resume and job description to receive AI-powered optimization suggestions. We provide ATS-friendly formatting recommendations, keyword optimization, skills gap analysis, and achievement quantification to help your resume stand out.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Certum AI free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Certum AI offers a free tier with limited usage to help you get started. We also offer premium plans with unlimited access to all features including AI interview practice, resume optimization, and job description analysis.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
