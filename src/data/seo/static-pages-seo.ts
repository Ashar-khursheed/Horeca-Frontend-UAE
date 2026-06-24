const SITE = process.env.NEXT_SITE_URL ?? "https://www.thehorecastore.com";

export const STATIC_SEO = {
  cart: {
    title: "Your Cart | HorecaStore",
    description: "Review and manage items in your HorecaStore shopping cart before proceeding to checkout.",
    robots: { index: false, follow: false },
    canonical: `${SITE}/cart`,
  },
  checkout: {
    title: "Checkout | HorecaStore",
    description: "Complete your purchase securely at HorecaStore. Fast, safe, and hassle-free checkout.",
    robots: { index: false, follow: false },
    canonical: `${SITE}/checkout`,
  },
  wishlist: {
    title: "My Wishlist | HorecaStore",
    description: "View and manage your saved products on HorecaStore.",
    robots: { index: false, follow: false },
    canonical: `${SITE}/wishlist`,
  },
  trackOrder: {
    title: "Track Your Order | HorecaStore",
    description: "Track the status and delivery of your HorecaStore order in real time.",
    robots: { index: false, follow: false },
    canonical: `${SITE}/track-order`,
  },
  paymentSuccess: {
    title: "Payment Successful | HorecaStore",
    description: "Your payment was processed successfully. Thank you for shopping with HorecaStore.",
    robots: { index: false, follow: false },
    canonical: `${SITE}/payment-success`,
  },
  paymentDecline: {
    title: "Payment Declined | HorecaStore",
    description: "Your payment could not be processed. Please try again or use a different payment method.",
    robots: { index: false, follow: false },
    canonical: `${SITE}/payment-decline`,
  },
  aboutUs: {
    title: "About HorecaStore | Trusted Commercial Kitchen Equipment Supplier",
    description: "Learn about HorecaStore — your trusted U.S. supplier for commercial kitchen equipment, restaurant supplies, and hospitality solutions. Serving hotels, restaurants, and cafés nationwide.",
    robots: { index: true, follow: true },
    canonical: `${SITE}/pages/about-us`,
    og: {
      title: "About HorecaStore – Trusted Commercial Kitchen Equipment Supplier",
      description: "Discover the story behind HorecaStore. We supply commercial kitchen equipment and restaurant supplies to hospitality businesses across the United States.",
    },
  },
  contactUs: {
    title: "Contact HorecaStore | Get Expert Support",
    description: "Get in touch with the HorecaStore team for product inquiries, quotes, order support, and expert advice on commercial kitchen equipment.",
    robots: { index: true, follow: true },
    canonical: `${SITE}/pages/contact-us`,
    og: {
      title: "Contact HorecaStore – Expert Support for Restaurant Equipment",
      description: "Have questions about commercial kitchen equipment? Contact HorecaStore for fast, expert support via phone or email.",
    },
  },
  startingARestaurant: {
    title: "Starting a Restaurant? | HorecaStore Equipment Guide",
    description: "Planning to open a restaurant? HorecaStore helps you source the right commercial kitchen equipment, from cooking ranges to refrigeration, all in one place.",
    robots: { index: true, follow: true },
    canonical: `${SITE}/starting-a-restaurant`,
    og: {
      title: "Starting a Restaurant? Get the Right Equipment with HorecaStore",
      description: "Everything you need to equip your new restaurant — from commercial ovens to prep tables. HorecaStore is your one-stop restaurant equipment supplier.",
    },
  },
};
