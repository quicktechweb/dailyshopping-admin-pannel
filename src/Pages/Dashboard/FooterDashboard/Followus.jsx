import { useEffect, useState } from "react";
import axios from "axios";
import { SOCIAL_ICONS } from "./socialIcons";

const API_URL = "http://localhost:5000/api/footer";

/**
 * Public "Follow Us" block.
 *
 * Usage 1 (self-fetching):     <FollowUs />
 * Usage 2 (Footer.jsx already fetches the config):
 *                              <FollowUs data={footerData.followUs} />
 */
export default function FollowUs({ data }) {
  const [followUs, setFollowUs] = useState(data || null);

  useEffect(() => {
    if (data) {
      setFollowUs(data);
      return;
    }

    let cancelled = false;
    axios
      .get(API_URL)
      .then((res) => {
        if (!cancelled && res.data?.success) {
          setFollowUs(res.data.data.followUs || null);
        }
      })
      .catch((err) => console.error("Follow Us fetch error:", err));

    return () => {
      cancelled = true;
    };
  }, [data]);

  const links = (followUs?.links || []).filter((l) => SOCIAL_ICONS[l.platform]);
  if (links.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-black mb-4">
        {followUs?.heading || "Follow Us"}
      </h3>

      <div className="flex flex-wrap items-center gap-4">
        {links.map((item, index) => {
          const { Icon, label } = SOCIAL_ICONS[item.platform];
          const isExternal = /^https?:\/\//i.test(item.url);

          return (
            <a
              key={`${item.platform}-${index}`}
              href={item.url || "#"}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={label}
              title={label}
              className="w-12 h-12 rounded-full bg-gray-100 text-slate-700 flex items-center justify-center text-xl transition-colors hover:bg-gray-200 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </div>
  );
}
