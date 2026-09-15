import { NotFoundContent } from "@/components/site/NotFoundContent";
import { SiteChrome } from "@/components/site/SiteChrome";

// Unmatched URLs render outside the (site) group, so the header and footer are added here.
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
