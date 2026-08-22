// import { useNavigate } from "react-router-dom";
import pdf from "@assets/pdf.png";
export interface SavedLink {
  id: string;
  title: string;
  icon:() => React.JSX.Element;
  // title: string;
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
import { BookmarkIcon, GithubIcon, PdfIcon,PinterestIcon } from '@/components/svg/homepageicons';
// import { PlusIcon } from '@/components/svg/plusicon';
import React from 'react';
// import { SavedLink } from '../types';

interface HeroCardProps {
  data: SavedLink;
}

export const HeroCard: React.FC<HeroCardProps> = ({ data }) => {
  return (
    <div className="bg-page border border-surface-muted backdrop-blur-md rounded-2xl p-4 flex flex-col
     justify-between shadow-sm hover:shadow-md transition-all
      duration-300">
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium mb-1">
          {data.icon()}
          {/* <span className="uppercase tracking-wider">{data.type}</span> */}
        <h3 className="font-semibold text-neutral-900 text-sm">{data.title}</h3>
        </div>
        <p className="text-xs text-neutral-500 mb-3">{data.subtitle}</p>
        <div className="w-full h-24 rounded-lg overflow-hidden mb-3 bg-neutral-200">
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-neutral-300/40">
        <img src={data.author.avatar} alt={data.author.name} className="w-5 h-5 rounded-full object-cover" />
        <span className="text-xs text-neutral-600">Shared by: <strong className="font-medium text-neutral-800">{data.author.name}</strong></span>
      </div>
    </div>
  );
};

// import React from 'react';
// import { HeroCard } from './HeroCard';
// import { SavedLink } from '../types';

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
    icon:()=><PdfIcon/>,
    title: 'PDF',
    subtitle: 'Q4 Report 2024',
    image: pdf,
    author: { name: 'Sarah', avatar: 'https://i.pravatar.cc/100?img=5' },
  },
  {
    id: '3',
    title: 'Pinterest',
    icon:()=> <PinterestIcon/>,
    subtitle: 'Design Ideas: Minimalist Kitchens',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Liam', avatar: 'https://i.pravatar.cc/100?img=33' },
  },
  {
    id: '4',
    title: 'Github',
    icon: ()=><GithubIcon/>,
    subtitle: 'App Component Repo',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    author: { name: 'Chloe', avatar: 'https://i.pravatar.cc/100?img=20' },
  },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#ECECE8] py-10 px-6 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-tight">
            Collect. Organise.<br />Access.
          </h1>
          <p className="text-neutral-600 text-base max-w-full leading-relaxed">
            All your valuable media links, effortlessly stored, neatly organized, and instantly available at your fingertips. The powerful, intelligent digital link manager you've been patiently waiting for.
          </p>
          <div className="pt-2 space-y-6">
            {/* Action Button */}
            <a 
              href="/signup" 
              className="bg-black hover:bg-black/90 text-white font-medium py-2.5 px-5 rounded-full inline-flex items-center justify-center gap-2 transition-all shadow-sm text-lg">
            
              <span>Get Started</span>
            </a>

            {/* Pagination Indicators */}
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
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {CARDS_DATA.map((card) => (
            <HeroCard key={card.id} data={card} />
          ))}
        </div>
      </div>

    </section>
  );
};

// import React from 'react';
// import { MetricItem } from '../types';

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
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 leading-tight">
            Seamless Link<br />Management
          </h2>
          <p className="text-neutral-600 max-w-lg leading-relaxed text-sm md:text-base">
            With our innovative link storing and organisation tools, never lose a web resource again. Intuitive, fast, and secure , designed for productivity.
          </p>
         {/* Action Button */}
            <a 
              href="/signup" 
              className="bg-black hover:bg-black/90 text-white font-medium py-2.5 px-5 rounded-full inline-flex items-center justify-center gap-2 transition-all shadow-sm text-lg"
            >
              <span>Learn More</span>
            </a>
        </div>

        {/* Right Column - Metrics */}
        <div className="lg:col-span-5 space-y-8">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="border-b border-neutral-200/60 pb-4 last:border-b-0">
              <div className="text-4xl font-bold tracking-wide text-neutral-900">{metric.value}</div>
              <div className="text-xs tracking-widest text-neutral-500 font-semibold mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// import React from 'react';

const footerColumns = [
  {
    title: 'Features',
    links: [{title: 'Dashboard',link: "/signin"},
       {title: 'Categories'}, {title: 'Collaboration'}],
  },
  {
    title: 'Resources',
    links: [{title: 'Tutorials'}, {title: "Privacy Policy"}, {title: "Terms of Service"}],
  },
  {
    title: 'Contact',
    links: [{title: "Github",link:"https://github.com/flashcode635/second-brain-application"}, {title: "Sign Up", link: "/signup"}],
  },
];

// export const Footer: React.FC = () => {
//   return (
//     <footer className="bg-[#F6F6F4] pt-8 px-4 sm:px-8 py-2">
//       {/* Curved Container Header Simulation */}
//       <div className="max-w-7xl mx-auto relative bg-[#1A1A1A] text-white rounded-2xl pt-12 px-8 md:px-14 pb-10">

//         {/* Notch Shape Decorative Overlay */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-5 bg-[#F6F6F4] rounded-b-2xl"></div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//           {/* Card Component Left */}
//           <div className="lg:col-span-4 bg-page flex rounded-2xl p-6 border border-neutral-800  gap-4 justify-between">
//             <div className="w-20 h-15 rounded-lg flex items-center justify-center mb-2">
//               <BrainIcon/>
//             </div>
//             <p className="text-sm text-black leading-relaxed">
//               Thoughtfully Designed for Productivity.
//             </p>
//           </div>

//           {/* Links Columns Right */}
//           <div className="lg:col-span-8 grid grid-cols-3 gap-6 text-sm text-neutral-400">
//             {footerColumns.map((column) => (
//               <div key={column.title}>
//                 <h4 className="font-semibold text-white mb-4 text-base font-sans">{column.title}</h4>
//                 <ul className="space-y-2.5">
//                   {column.links.map((link) => (
//                     <li key={link}>
//                       <a href="#" className="hover:text-white transition-colors">{link}</a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Big Brand Logo Banner */}
//         {/* <div className="mt-12 pt-6 border-t border-neutral-800 bg-[#111111] rounded-2xl p-6 flex justify-between items-center overflow-hidden relative">
//           <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider text-white uppercase select-none">
//             LINKHUB
//           </h1>
//           <div className="text-neutral-500">
//             <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
//             </svg>
//           </div>
//         </div> */}
//       </div>
//     </footer>
//   );
// };

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F6F6F4] pt-8 px-4 sm:px-8 py-2">
      <div className="max-w-7xl mx-auto relative text-white">
        
        {/* TOP TAB CUTOUT SHAPE (SVG Background Mask) */}
        <div className="relative w-full">
          <svg
            className="w-full h-13 block text-[#1A1A1A]"
            viewBox="0 0 1200 52"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            {/* Folder tab profile path matching the image curve */}
            <path d="M 0,52 L 0,16 C 0,7.16 7.16,0 16,0 L 260,0 C 275,0 280,18 290,26 C 298,32 308,34 320,34 L 880,34 C 892,34 902,32 910,26 C 920,18 925,0 940,0 L 1184,0 C 1192.84,0 1200,7.16 1200,16 L 1200,52 Z" />
          </svg>
        </div>

        {/* MAIN CONTAINER CONTENT */}
        <div className="bg-[#1A1A1A] rounded-b-2xl px-8 md:px-14 pt-4 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Card Component Left */}
            <div className="lg:col-span-4 bg-page flex rounded-2xl p-4 border border-gray-500/20 gap-4 justify-between items-center">
              <div className="w-16 h-12 rounded-lg flex items-center justify-center shrink-0">
                {/* Replace with your BrainIcon */}
                <span className="text-xl">
                  <BrainIcon size="medium" />
                </span>
              </div>
              <p className="text-sm font-semibold text-text-primary leading-relaxed font-sans">
                Thoughtfully Designed for Productivity.
              </p>
            </div>

            {/* Links Columns Right */}
            <div className="lg:col-span-8 grid grid-cols-3 gap-6 text-sm text-neutral-400">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h4 className="font-semibold text-white mb-4 text-base font-sans">
                    {column.title}
                  </h4>
                  <ul className="space-y-2">
                    {column.links.map((link:any) => (
                      <li key={link.link??link.title}>
                        { link.link? (<a
                          href={link.link}
                          className="hover:text-white transition-colors duration-200"
                        >
                          {link.title}
                        </a>) : (<span className="">{link.title}</span>)}
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
};