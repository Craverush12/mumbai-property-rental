interface MetaData {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'property';
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterCreator?: string;
  twitterSite?: string;
}

class MetaService {
  private static instance: MetaService;
  private defaultMeta: MetaData = {
    title: 'Infiniti Casa - Luxury Boutique Rentals in Mumbai',
    description: 'Discover Mumbai\'s most exclusive boutique stays. Experience luxury, comfort, and authentic local experiences in carefully curated properties.',
    image: '/logocasa.png',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    type: 'website',
    siteName: 'Infiniti Casa',
    twitterCard: 'summary_large_image',
    twitterCreator: '@infiniticasa',
    twitterSite: '@infiniticasa'
  };

  private constructor() {}

  static getInstance(): MetaService {
    if (!MetaService.instance) {
      MetaService.instance = new MetaService();
    }
    return MetaService.instance;
  }

  updateMetaTags(metaData: Partial<MetaData>): void {
    const data = { ...this.defaultMeta, ...metaData };
    
    // Basic meta tags
    this.setMetaTag('title', data.title);
    this.setMetaTag('description', data.description);
    this.setMetaTag('image', data.image);
    this.setMetaTag('url', data.url);

    // Open Graph tags
    this.setMetaTag('og:title', data.title);
    this.setMetaTag('og:description', data.description);
    this.setMetaTag('og:image', data.image);
    this.setMetaTag('og:url', data.url);
    this.setMetaTag('og:type', data.type);
    this.setMetaTag('og:site_name', data.siteName);

    // Twitter Card tags
    this.setMetaTag('twitter:card', data.twitterCard);
    this.setMetaTag('twitter:title', data.title);
    this.setMetaTag('twitter:description', data.description);
    this.setMetaTag('twitter:image', data.image);
    this.setMetaTag('twitter:creator', data.twitterCreator);
    this.setMetaTag('twitter:site', data.twitterSite);

    // Additional SEO tags
    this.setMetaTag('robots', 'index, follow');
    this.setMetaTag('author', 'Infiniti Casa');
    this.setMetaTag('keywords', 'luxury rentals, boutique stays, Mumbai, luxury accommodation, premium rentals');
  }

  private setMetaTag(name: string, content?: string): void {
    if (!content) return;

    // Handle title tag separately
    if (name === 'title') {
      document.title = content;
      return;
    }

    // Find existing meta tag or create new one
    let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
    }

    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        metaTag.setAttribute('property', name);
      } else {
        metaTag.setAttribute('name', name);
      }
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', content);
  }

  updatePropertyMetaTags(property: any): void {
    const propertyMeta: MetaData = {
      title: `${property.name} - Luxury Boutique Rental in ${property.location} | Infiniti Casa`,
      description: `${property.description} Experience luxury and comfort in this ${property.category.toLowerCase()} property in ${property.location}. Book your stay with Infiniti Casa.`,
      image: property.images?.[0] || this.defaultMeta.image,
      url: `${this.defaultMeta.url}/property/${property.id}`,
      type: 'article',
      siteName: this.defaultMeta.siteName,
      twitterCard: 'summary_large_image'
    };

    this.updateMetaTags(propertyMeta);
  }

  updateComparisonMetaTags(properties: any[]): void {
    const propertyNames = properties.map(p => p.name).join(' vs ');
    const comparisonMeta: MetaData = {
      title: `Compare ${propertyNames} | Property Comparison | Infiniti Casa`,
      description: `Compare luxury boutique properties: ${propertyNames}. Find the perfect stay with detailed comparisons of amenities, pricing, and locations.`,
      image: this.defaultMeta.image,
      url: `${this.defaultMeta.url}/compare`,
      type: 'website',
      siteName: this.defaultMeta.siteName
    };

    this.updateMetaTags(comparisonMeta);
  }

  updateBookingMetaTags(booking: any): void {
    const bookingMeta: MetaData = {
      title: `Booking Confirmation - ${booking.property?.name} | Infiniti Casa`,
      description: `Your booking for ${booking.property?.name} has been confirmed. Check your booking details and prepare for your luxury stay in Mumbai.`,
      image: booking.property?.images?.[0] || this.defaultMeta.image,
      url: `${this.defaultMeta.url}/booking/${booking.id}`,
      type: 'article',
      siteName: this.defaultMeta.siteName
    };

    this.updateMetaTags(bookingMeta);
  }

  resetToDefault(): void {
    this.updateMetaTags(this.defaultMeta);
  }

  generateStructuredData(property?: any): string {
    if (!property) {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Infiniti Casa",
        "description": "Luxury boutique rentals in Mumbai",
        "url": this.defaultMeta.url,
        "logo": `${this.defaultMeta.url}/logocasa.png`,
        "sameAs": [
          "https://facebook.com/infiniticasa",
          "https://twitter.com/infiniticasa",
          "https://instagram.com/infiniticasa"
        ]
      });
    }

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": property.name,
      "description": property.description,
      "image": property.images,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.location,
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "priceRange": `₹${property.price}`,
      "numberOfRooms": property.bedrooms,
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Guests",
          "value": property.guests
        },
        {
          "@type": "LocationFeatureSpecification", 
          "name": "Bedrooms",
          "value": property.bedrooms
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Bathrooms", 
          "value": property.bathrooms
        }
      ],
      "url": `${this.defaultMeta.url}/property/${property.id}`
    });
  }

  injectStructuredData(structuredData: string): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = structuredData;
    document.head.appendChild(script);
  }

  generateSitemapData(): any[] {
    // This would typically come from your database
    return [
      {
        url: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        url: '/properties',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9
      },
      {
        url: '/about',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: '/contact',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      }
    ];
  }

  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: ${this.defaultMeta.url}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# Allow important pages
Allow: /properties/
Allow: /property/
Allow: /about/
Allow: /contact/`;
  }
}

export default MetaService.getInstance(); 