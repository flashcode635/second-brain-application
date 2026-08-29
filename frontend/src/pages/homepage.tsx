// import { useNavigate } from "react-router-dom";
import pdf from "@assets/pdf.png";
export interface SavedLink {
  id: string;
  title: string;
  variant?: 'tall' | 'wide' | 'normal';
  icon: () => React.JSX.Element;
  subtitle: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface MetricItem {
  value: string;
  label: string;
}

import BrainIcon from '@/components/svg/brainicon';
import { BookmarkIcon, GithubIcon, PdfIcon, PinterestIcon } from '@/components/svg/homepageicons';
import React from 'react';



interface HeroCardProps {
  data: SavedLink;
  index: number;
  variant?: 'tall' | 'short';
}

export const HeroCard: React.FC<HeroCardProps> = ({ data, index, variant = 'short' }) => {
  const imageHeight = variant === 'tall' ? 'h-40 sm:h-50' : 'h-24';

  return (
    <div className="sb-card h-full rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
            {data.icon()}
            <h3 className="font-semibold text-neutral-900 text-sm">{data.title}</h3>
          </div>
          <span className="sb-mono text-[10px] text-[#B07020]/70">
            N&deg;{String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <p className="sb-mono text-[11px] uppercase tracking-wide text-neutral-500 mb-3">
          {data.subtitle}
        </p>
        <div className={`w-full ${imageHeight} rounded-md overflow-hidden mb-3 bg-neutral-200 transition-[height] duration-300`}>
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-neutral-300/40">
        <img src={data.author.avatar} alt={data.author.name} className="w-5 h-5 rounded-full object-cover" />
        <span className="text-xs text-neutral-600">
          Shared by <strong className="font-medium text-neutral-800">{data.author.name}</strong>
        </span>
      </div>
    </div>
  );
};

const CARDS_DATA: SavedLink[] = [
  {
    id: '1',
    icon: () => <BookmarkIcon />,
    title: "Link bookmark",
    subtitle: 'The Verge: Tech News',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    author: { name: 'Alex', avatar: 'https://i.pravatar.cc/100?img=12' },
  },
  {
    id: '2',
    icon: () => <PdfIcon />,
    title: 'PDF',
    subtitle: 'Q4 Report 2024',
    image: pdf,
    author: { name: 'Sarah', avatar: 'https://i.pravatar.cc/100?img=5' },
  },
  {
    id: '3',
    title: 'Github',
    icon: () => <GithubIcon />,
    subtitle: 'App Component Repo',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Chloe', avatar: 'https://i.pravatar.cc/100?img=20' },
  },
  {
    id: '4',
    title: 'Pinterest',
    icon: () => <PinterestIcon />,
    subtitle: 'Design Ideas: Minimalist Kitchens',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Liam', avatar: 'https://i.pravatar.cc/100?img=33' },
  },
  
];

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#ECECE8] py-10 px-6 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          <span className="sb-mono text-xs uppercase tracking-widest text-[#B07020]">
            Second Brain
          </span>
          <h1 className="sb-display text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.05]">
            Collect. Organise.<br />Access.
          </h1>
          <p className="text-neutral-600 text-base max-w-md leading-relaxed">
            All your valuable media links, effortlessly stored, neatly organized, and instantly available at your fingertips — the digital link manager you've been waiting for.
          </p>
          <div className="pt-2 space-y-6">
            <a
            
              href="/signup"
              className="sb-cta bg-[#1A1A1A] hover:bg-black text-white font-medium py-2.5 px-5 rounded-md inline-flex items-center gap-2 text-sm"
            >
              <span>Get started</span>
              <span aria-hidden="true">→</span>
            </a>

            <div className="flex justify-between items-center max-w-7xl mx-auto pt-6">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-black/30"></span>
                <span className="w-3 h-3 rounded-full bg-black/60"></span>
              </div>
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm border border-black/20"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-black/20"></span>
              </div>
            </div>
          </div>
        </div>

                  {/* Right Column - Grid */}
            <div className="lg:col-span-6 sb-grid pt-3">
              <div className="sb-col">
                <HeroCard data={CARDS_DATA[0]} index={0} variant="tall" />
                <HeroCard data={CARDS_DATA[2]} index={2} variant="short" />
              </div>
              <div className="sb-col">
                <HeroCard data={CARDS_DATA[1]} index={1} variant="short" />
                <HeroCard data={CARDS_DATA[3]} index={3} variant="tall" />
              </div>
            </div>
      </div>
    </section>
  );
};

const METRICS: MetricItem[] = [
  { value: '< 100ms', label: 'URL FETCH SPEED' },
  { value: '1 Click', label: 'INSTANT SHARE' },
  { value: '100%', label: 'FREE & OPEN SOURCE' },
];

export const MetricsSection: React.FC = () => {
  return (
    <section className="bg-[#F6F6F4] py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="sb-display text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 leading-tight">
            Seamless link<br />management
          </h2>
          <p className="text-neutral-600 max-w-lg leading-relaxed text-sm md:text-base">
            With our innovative link storing and organisation tools, never lose a web resource again. Intuitive, fast, and secure — designed for productivity.
          </p>
          <a
            href="/signup"
            className="sb-cta bg-[#1A1A1A] hover:bg-black text-white font-medium py-2.5 px-5 rounded-md inline-flex items-center gap-2 text-sm"
          >
            <span>Learn more</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Right Column - Metrics */}
        <div className="lg:col-span-5 space-y-8">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="flex items-baseline gap-4 border-b border-neutral-200/60 pb-4 last:border-b-0">
              <span className="sb-mono text-xs text-[#B07020]/70 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="sb-display text-4xl font-medium text-neutral-900">{metric.value}</div>
                <div className="sb-mono text-[11px] tracking-widest text-neutral-500 font-medium mt-1">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const footerColumns = [
  {
    title: 'Features',
    links: [{ title: 'Dashboard', link: "/signin" }, { title: 'Categories' }, { title: 'Collaboration' }],
  },
  {
    title: 'Resources',
    links: [{ title: 'Tutorials' }, { title: "Privacy Policy" }, { title: "Terms of Service" }],
  },
  {
    title: 'Contact',
    links: [{ title: "Github", link: "https://github.com/flashcode635/second-brain-application" }, { title: "Sign Up", link: "/signup" }],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F6F6F4] pt-8 px-4 sm:px-8 py-2">
      <div className="max-w-7xl mx-auto relative text-white">

        {/* Folder-tab cutout — this is the page's one signature shape,
           reused below in the card corners; keep it, don't dilute it. */}
        <div className="relative w-full">
          <svg
            className="w-full h-13 block text-[#1A1A1A]"
            viewBox="0 0 1200 52"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M 0,52 L 0,16 C 0,7.16 7.16,0 16,0 L 260,0 C 275,0 280,18 290,26 C 298,32 308,34 320,34 L 880,34 C 892,34 902,32 910,26 C 920,18 925,0 940,0 L 1184,0 C 1192.84,0 1200,7.16 1200,16 L 1200,52 Z" />
          </svg>
        </div>

        <div className="bg-[#1A1A1A] rounded-b-2xl px-8 md:px-14 pt-4 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 bg-page flex rounded-2xl p-4 border border-gray-500/20 gap-4 justify-between items-center">
              <div className="w-16 h-12 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xl">
                  <BrainIcon size="medium" />
                </span>
              </div>
              <p className="text-sm font-semibold text-text-primary leading-relaxed font-sans">
                Thoughtfully designed for productivity.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-3 gap-6 text-sm text-neutral-400">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h4 className="sb-mono font-medium text-white mb-4 text-xs uppercase tracking-widest">
                    {column.title}
                  </h4>
                  <ul className="space-y-2">
                    {column.links.map((link: any) => (
                      <li key={link.link ?? link.title}>
                        {link.link ? (
                          <a href={link.link} className="hover:text-white transition-colors duration-200">
                            {link.title}
                          </a>
                        ) : (
                          <span>{link.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F6F4] text-neutral-900 font-sans antialiased">
      <main>
        <HeroSection />
        <MetricsSection />
      </main>
      <Footer />
    </div>
  );
}