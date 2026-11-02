import {
  EnvelopeSimpleIcon,
  InstagramLogoIcon,
  PinterestLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/ssr";
import { devStandIns, type SiteContent } from "@/lib/cms";
import { contact } from "@/lib/content";

const icons = {
  Instagram: InstagramLogoIcon,
  Pinterest: PinterestLogoIcon,
  YouTube: YoutubeLogoIcon,
};

export function SiteFooter({ site }: { site: SiteContent | null }) {
  const standIn = !site && devStandIns();
  const email = site?.email || (standIn ? contact.email : "");
  const socials = site ? site.socials : standIn ? contact.socials : [];

  return (
    <footer className="px-4 pt-16 pb-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 border-t-2 border-ink pt-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-body text-base text-ink">© 2026 Rosa</p>
        <div className="sm:text-right">
          {email ? (
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 font-body text-base text-ink">
              <EnvelopeSimpleIcon weight="light" size={22} aria-hidden="true" />
              {email}
            </a>
          ) : null}
          <ul className="mt-3 flex gap-2 sm:justify-end">
            {socials.map((social) => {
              const Icon = icons[social.name as keyof typeof icons];
              if (!Icon) return null;
              return (
                <li key={social.name}>
                  <a
                    href={social.href}
                    aria-label={social.name}
                    className="grid size-11 place-items-center border-2 border-ink text-ink hover:bg-ink hover:text-lace"
                  >
                    <Icon weight="light" size={22} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
