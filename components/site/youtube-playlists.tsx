import Image from "next/image"
import {
  IconArrowUpRight,
  IconBrandYoutube,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"

import { SectionHeading } from "@/components/site/section-heading"

const PLAYLISTS = [
  {
    title: "Excel Charts & Data Visualisation",
    subtitle:
      "Learn to create dynamic, presentation-ready charts, trendlines, and executive dashboard graphics.",
    image: "/images/youtube/charts.jpg",
    badge: "Charts & Visuals",
    url: "https://www.youtube.com/watch?v=ri-FTrsRRHc&list=PLTGwhh2mhHoWCZGmzERq6gwdGag58sUhc",
  },
  {
    title: "Excel Pivot Tables & Data Analysis",
    subtitle:
      "Deep dive into summarising large datasets, calculated fields, dynamic grouping, and smart slicers.",
    image: "/images/youtube/pivot-tables.jpg",
    badge: "Data Analysis",
    url: "https://www.youtube.com/watch?v=E8E5E9GYa2M&list=PLTGwhh2mhHoUEnc2XSu9Ng3mY-vBrbxky",
  },
  {
    title: "Excel Pro Tips & Productivity Shortcuts",
    subtitle:
      "Hidden keyboard shortcuts, smart formula tricks, and time-saving techniques used by spreadsheet pros.",
    image: "/images/youtube/pro-tips.jpg",
    badge: "Pro Tips & Tricks",
    url: "https://www.youtube.com/watch?v=DRGgiZKtc6w&list=PLTGwhh2mhHoWpwxoEqSNfh7c7Feku05pW",
  },
  {
    title: "Excel for Statistics & Forecasting",
    subtitle:
      "Master statistical distributions, standard deviations, regression trends, and analytical forecasting models.",
    image: "/images/youtube/statistics.jpg",
    badge: "Statistical Modeling",
    url: "https://www.youtube.com/watch?v=-pduV83nuXA&list=PLTGwhh2mhHoVOXOiMQKOkco9Re-w-oAPH",
  },
]

export function YoutubePlaylists() {
  return (
    <section className="py-14 sm:py-18">
      <SectionHeading
        badge="Video Masterclasses"
        title="YouTube Playlists & Video Tutorials"
        subtitle="Explore our YouTube channel for step-by-step Excel video masterclasses. Watch complete playlists on popular formulas and spreadsheet challenges."
        action={{ label: "Visit YouTube Channel", href: "https://youtube.com" }}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLAYLISTS.map((playlist) => (
          <a
            key={playlist.title}
            href={playlist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/40 hover:shadow-xl"
          >
            <div>
              {/* Video Thumbnail Header */}
              <div className="relative aspect-16/9 w-full overflow-hidden border-b border-border/50 bg-muted">
                <Image
                  src={playlist.image}
                  alt={playlist.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Floating YouTube Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/90 text-white shadow-xl backdrop-blur-xs transition-all duration-300 group-hover:scale-115 group-hover:bg-red-600 group-hover:shadow-2xl">
                    <IconPlayerPlayFilled className="h-6 w-6 translate-x-0.5" />
                  </div>
                </div>

                {/* Playlist Category Badge */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow-xs backdrop-blur-xs">
                  <IconBrandYoutube className="h-3.5 w-3.5 text-red-600" />
                  <span>{playlist.badge}</span>
                </div>
              </div>

              {/* Text Details */}
              <div className="p-5 sm:p-6 space-y-2">
                <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-red-600 sm:text-xl">
                  {playlist.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {playlist.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom Link Action */}
            <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-border/60 mt-3 pt-4 text-xs font-bold text-red-600">
              <span className="inline-flex items-center gap-1.5">
                <IconBrandYoutube className="h-4 w-4" />
                <span>Watch full playlist on YouTube</span>
              </span>
              <IconArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
