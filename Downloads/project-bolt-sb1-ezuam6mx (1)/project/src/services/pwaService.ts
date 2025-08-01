// Extend Navigator interface for iOS standalone mode
declare global {
  interface Navigator {
    standalone?: boolean;
  }
  
  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  startUrl: string;
  scope: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }[];
}

class PWAService {
  private static instance: PWAService;
  private deferredPrompt: any = null;
  private isInstalled = false;

  private config: PWAConfig = {
    name: 'Infiniti Casa - Luxury Boutique Rentals',
    shortName: 'Infiniti Casa',
    description: 'Discover Mumbai\'s most exclusive boutique stays',
    themeColor: '#1e3a8a',
    backgroundColor: '#ffffff',
    display: 'standalone',
    startUrl: '/',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ]
  };

  private constructor() {
    this.init();
  }

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  private async init(): Promise<void> {
    try {
      await this.registerServiceWorker();
      this.setupInstallPrompt();
      this.checkInstallationStatus();
      this.setupAppUpdateListener();
    } catch (error) {
      console.error('PWA initialization failed:', error);
    }
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registered successfully:', registration);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
              }
            });
          }
        });

        // Handle service worker activation
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('New service worker activated');
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log('PWA was installed');
    });
  }

  private checkInstallationStatus(): void {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Check if running in iOS Safari
    if (window.navigator.standalone) {
      this.isInstalled = true;
    }
  }

  private setupAppUpdateListener(): void {
    // Listen for app visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });

    // Check for updates when app comes online
    window.addEventListener('online', () => {
      this.checkForUpdates();
    });
  }

  async showInstallPrompt(): Promise<void> {
    if (this.deferredPrompt && !this.isInstalled) {
      // Create and show install prompt UI
      const installButton = document.createElement('button');
      installButton.textContent = 'Install App';
      installButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      installButton.onclick = async () => {
        await this.installApp();
        installButton.remove();
      };

      document.body.appendChild(installButton);

      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (installButton.parentNode) {
          installButton.remove();
        }
      }, 10000);
    }
  }

  private async installApp(): Promise<void> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      this.deferredPrompt = null;
    }
  }

  private showUpdateNotification(): void {
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Available - Click to Update';
    updateButton.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    updateButton.onclick = () => {
      window.location.reload();
    };

    document.body.appendChild(updateButton);

    // Auto-hide after 15 seconds
    setTimeout(() => {
      if (updateButton.parentNode) {
        updateButton.remove();
      }
    }, 15000);
  }

  private async checkForUpdates(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }
  }

  async enableBackgroundSync(tag: string, data?: any): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Store data for background sync
        if (data) {
          await this.storeSyncData(tag, data);
        }

        if (registration.sync) {
          await registration.sync.register(tag);
        }
        console.log('Background sync registered:', tag);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  private async storeSyncData(tag: string, data: any): Promise<void> {
    try {
      const syncData = {
        tag,
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`sync_${tag}`, JSON.stringify(syncData));
    } catch (error) {
      console.error('Error storing sync data:', error);
    }
  }

  async getStoredSyncData(tag: string): Promise<any> {
    try {
      const stored = localStorage.getItem(`sync_${tag}`);
      if (stored) {
        const syncData = JSON.parse(stored);
        localStorage.removeItem(`sync_${tag}`);
        return syncData.data;
      }
    } catch (error) {
      console.error('Error retrieving sync data:', error);
    }
    return null;
  }

  async cacheData(url: string, data: any): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('infiniti-casa-data');
        const response = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(url, response);
      } catch (error) {
        console.error('Error caching data:', error);
      }
    }
  }

  async getCachedData(url: string): Promise<any> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('infiniti-casa-data');
        const response = await cache.match(url);
        if (response) {
          return await response.json();
        }
      } catch (error) {
        console.error('Error retrieving cached data:', error);
      }
    }
    return null;
  }

  generateManifest(): string {
    return JSON.stringify(this.config, null, 2);
  }

  injectManifest(): void {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add theme color meta tag
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = this.config.themeColor;
    document.head.appendChild(themeColorMeta);

    // Add apple touch icons
    this.config.icons.forEach(icon => {
      if (icon.sizes === '192x192' || icon.sizes === '512x512') {
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.sizes = icon.sizes;
        appleTouchIcon.href = icon.src;
        document.head.appendChild(appleTouchIcon);
      }
    });

    // Add apple mobile web app capable meta tag
    const appleWebAppMeta = document.createElement('meta');
    appleWebAppMeta.name = 'apple-mobile-web-app-capable';
    appleWebAppMeta.content = 'yes';
    document.head.appendChild(appleWebAppMeta);

    // Add apple mobile web app status bar style
    const appleStatusBarMeta = document.createElement('meta');
    appleStatusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusBarMeta.content = 'default';
    document.head.appendChild(appleStatusBarMeta);
  }

  isStandalone(): boolean {
    return this.isInstalled || 
           window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  getInstallPrompt(): any {
    return this.deferredPrompt;
  }

  async shareData(data: any): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        console.error('Error sharing data:', error);
      }
    }
  }

  async getLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }
}

export default PWAService.getInstance(); 