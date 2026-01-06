;
import { ExternalLink } from "lucide-react";

const imageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Card({ imgSrc, title, description, href, onClick }) {
  const CardContent = (
    <>
      <div className="aspect-video overflow-hidden">
        <img
          loader={imageLoader}
          src={imgSrc}
          // width={500}
          // height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          alt={title}
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3
                   opacity-0 group-hover:opacity-100 active:opacity-100
                   transition-opacity duration-300 flex flex-col justify-end"
      >
        {/* <h3
          className="font-semibold text-white text-lg"
        >
          {title}
        </h3> */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-white/80 hover:text-white text-sm mt-2 flex items-center gap-1 w-fit"
        >
          <ExternalLink size={14} />
          <span>YouTubeで見る</span>
        </a>
      </div>
    </>
  );

  return (
    <div 
      className="bg-[var(--card-background)] rounded-sm overflow-hidden relative group cursor-pointer" 
      onClick={onClick}
    >
      {CardContent}
    </div>
  );
}
