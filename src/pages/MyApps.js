import React from 'react';
import Navbar from '../components/Navbar';
import myApps from '../data/myApps';

const sections = [
  { platform: 'Android', title: 'Mobile Apps', subtitle: 'Android' },
  { platform: 'Desktop', title: 'Desktop App', subtitle: 'Windows & Linux' },
];

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

function AppCard({ app }) {
  const links = app.downloads.filter((d) => d.url && d.url.trim());

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={app.logo}
          alt={`${app.name} logo`}
          className="w-20 h-20 flex-shrink-0 object-contain"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">{app.platform}</span>
            {app.version && <span className="text-xs text-gray-500">v{app.version}</span>}
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{app.description}</p>

      {links.length > 0 ? (
        <div className="space-y-2">
          {links.map((d) => (
            <a
              key={d.label}
              href={d.url}
              download
              className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold px-4 py-3 rounded-xl hover:bg-orange-500 transition-colors duration-300"
            >
              <DownloadIcon />
              {d.label}
            </a>
          ))}
        </div>
      ) : (
        <div className="w-full text-center bg-gray-100 text-gray-500 font-semibold px-4 py-3 rounded-xl">
          Coming soon
        </div>
      )}
    </div>
  );
}

export default function MyApps() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Apps</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Download the latest versions of our mobile and desktop apps.
          </p>
        </div>

        {sections.map((section) => {
          const apps = myApps.filter((a) => a.platform === section.platform);
          if (apps.length === 0) return null;
          return (
            <section key={section.platform} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
              <p className="text-gray-500 text-sm mb-6">{section.subtitle}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Installing on Android</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
            <li>Tap <strong>Download APK</strong> and open the file when it finishes.</li>
            <li>If asked, allow your browser to <strong>install unknown apps</strong> in Settings.</li>
            <li>Tap <strong>Install</strong>. To update later, download the new APK and install it over the old one.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
