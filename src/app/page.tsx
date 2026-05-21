import HomePage from "@/features/home";
import { SliderItem } from "@/features/home/hero-banner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://test-us.thehorecastore.co/api/frontend";

export const revalidate = 3600;

export default async function Page() {
  let sliderItems: SliderItem[] = [];

  try {
    const res = await fetch(`${API_BASE}/sliders/1`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      sliderItems = data.items ?? [];
    }
  } catch {
    // fallback — HeroBanner will use FALLBACK_SLIDES
  }
  let sliderItemsTwo: SliderItem[] = [];

  try {
    const res = await fetch(`${API_BASE}/sliders/2`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      sliderItemsTwo = data.items ?? [];
    }
  } catch {
    // fallback — HeroBanner will use FALLBACK_SLIDES
  }

  return (
    <main>
      <HomePage sliderItems={sliderItems} sliderItemsTwo={sliderItemsTwo} />
    </main>
  );
}
