// Apps listed on the "My Apps" page (/my-apps).
//
// To publish a build, paste its Cloudflare R2 public link into the matching
// `url` below, e.g.
//   url: 'https://pub-xxxxxxxx.r2.dev/android/admin-v1.0.0.apk'
//
// A download button only appears once its `url` is filled in. An app with no
// links yet shows "Coming soon". Logos live in /public/apps.

const myApps = [
  {
    id: 'admin',
    name: 'Admin',
    platform: 'Android',
    version: '1.0.0',
    description: 'For managers and administrators to run dealers, orders, products and customers.',
    logo: '/apps/admin.png',
    downloads: [
      { label: 'Download APK', url: 'https://pub-31d8ce6f039f43919684e660ddcc543c.r2.dev/admin-v1.0.0.apk' },
    ],
  },
  {
    id: 'dealers',
    name: 'Dealers',
    platform: 'Android',
    version: '1.0.0',
    description: "The dealer's own account, balance and orders.",
    logo: '/apps/dealers.png',
    downloads: [
      { label: 'Download APK', url: 'https://pub-31d8ce6f039f43919684e660ddcc543c.r2.dev/dealers-v1.0.0.apk' },
    ],
  },
  {
    id: 'customer-care',
    name: 'Customer Care',
    platform: 'Android',
    version: '1.0.0',
    description: 'Look up orders, customers and live product stock and prices.',
    logo: '/apps/customer-care.png',
    downloads: [
      { label: 'Download APK', url: 'https://pub-31d8ce6f039f43919684e660ddcc543c.r2.dev/customer care-v1.0.0.apk' },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics',
    platform: 'Android',
    version: '1.0.0',
    description: 'Receives repair and exchange items coming back from customers.',
    logo: '/apps/logistics.png',
    downloads: [
      { label: 'Download APK', url: 'https://pub-31d8ce6f039f43919684e660ddcc543c.r2.dev/logistics-v1.0.0.apk' },
    ],
  },
  {
    id: 'battery-assembly',
    name: 'Battery & Assembly',
    platform: 'Android',
    version: '1.0.0',
    description: 'Receives repair items from logistics and picked orders from the warehouse, and sends them on.',
    logo: '/apps/battery-assembly.png',
    downloads: [
      { label: 'Download APK', url: 'https://pub-31d8ce6f039f43919684e660ddcc543c.r2.dev/battery and assembly-v1.0.0.apk' },
    ],
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    platform: 'Desktop',
    version: '1.0.0',
    description: 'Desk app for products, stock, receiving and order dispatch.',
    logo: '/apps/warehouse.png',
    downloads: [
      { label: 'Windows (.exe)', url: 'https://pub-31d8ce6f039f43919684e660ddcc543c.r2.dev/Warehouse Setup 1.0.0.exe' },
      { label: 'Linux (.AppImage)', url: '' },
      { label: 'Linux (.deb)', url: '' },
    ],
  },
];

export default myApps;
