import Link from "next/link";
import { MapPin, Sparkles, Star } from "lucide-react";

export interface ServiceCardProps {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  vendorId?: {
    name: string;
    businessName?: string;
    image?: string;
    subscriptionPlan?: string;
  };
}

export default function ServiceCard({ service }: { service: ServiceCardProps }) {
  const imageUrl = service.images && service.images.length > 0 
    ? service.images[0] 
    : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

  const isPremiumVendor = service.vendorId?.subscriptionPlan === "premium";

  return (
    <div className="group rounded-2xl bg-stone-900/90 border border-stone-800/80 overflow-hidden hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300 flex flex-col">
      {/* Service Image */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-950">
        <img
          src={imageUrl}
          alt={service.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-80" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-stone-900/80 backdrop-blur-md text-rose-300 border border-stone-700/50">
          {service.category}
        </span>

        {/* Premium Vendor Badge */}
        {isPremiumVendor && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-500/90 backdrop-blur-md text-stone-950 flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 fill-stone-950" />
            Featured
          </span>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor Information */}
          <div className="flex items-center gap-2 mb-2">
            {service.vendorId?.image ? (
              <img
                src={service.vendorId.image}
                alt={service.vendorId.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-rose-500/40"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-rose-900/60 text-rose-200 text-xs flex items-center justify-center font-bold">
                {service.vendorId?.name ? service.vendorId.name.charAt(0) : "V"}
              </div>
            )}
            <span className="text-xs text-stone-400 font-medium truncate">
              {service.vendorId?.businessName || service.vendorId?.name || "Verified Wedding Vendor"}
            </span>
          </div>

          {/* Service Name */}
          <h3 className="text-lg font-serif font-semibold text-stone-100 group-hover:text-rose-300 transition line-clamp-1 mb-1.5">
            {service.serviceName}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-4">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{service.location}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono">Starting at</span>
            <p className="text-lg font-bold text-rose-400 font-mono">
              ${service.price.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40 transition hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
