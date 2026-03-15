"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, MoveLeft, MoveRight, Phone } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
}

// ── Dummy Data ─────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] =[
    {
        "id": 1,
        "name": "Restaurant Equipment",
        "slug": "restaurant-equipment",
        "parent_id": 0,
        "productCount": 9,
        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ddYqUoy0aUywKjyC12SyOtQcATDEEetvdfxrgw1V.webp",
        "order": 1,
        "children": [
            {
                "id": 61,
                "name": "Commercial Coffee Machines",
                "slug": "commercial-coffee-machine",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/coffee-machine-1.png",
                "order": 5,
                "children": [
                    {
                        "id": 170,
                        "name": "Commercial Espresso Machine",
                        "slug": "commercial-espresso-machine",
                        "parent_id": 61,
                        "productCount": 30,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UJBrToZNSOjLCzaCVFvRSGVMrrblB6RjLivlNFUv.webp",
                        "order": 8,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 601,
                        "name": "Espresso Grinder",
                        "slug": "espresso-grinder",
                        "parent_id": 61,
                        "productCount": 7,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/jcPC0vvTlNNcbwPNWlXuJXFyOTqQPkL3DYv6Yk5i.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 602,
                        "name": "Coffee Bean Grinder",
                        "slug": "coffee-bean-grinder",
                        "parent_id": 61,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/cGphnXWD5l7vvhHF89XlDDDN8Xp0Ufo2McfxsrRD.webp",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 603,
                        "name": "Coffee Urn",
                        "slug": "coffee-urn",
                        "parent_id": 61,
                        "productCount": 11,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DwhO6RGxIZt3Z3OPYUw6bMF3s9qKFInhv2v8VEC8.webp",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 63,
                "name": "Beverage Equipment",
                "slug": "beverage-equipment",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/beverage-equipment-1.png",
                "order": 7,
                "children": [
                    {
                        "id": 607,
                        "name": "Refrigerated Beverage Dispenser",
                        "slug": "refrigerated-beverage-dispenser",
                        "parent_id": 63,
                        "productCount": 28,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DVOInqsCTMvy7BisxnZumcBjSnPvBPmBPZou4l81.webp",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 610,
                        "name": "Citrus Juicer",
                        "slug": "citrus-juicer",
                        "parent_id": 63,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/fQ6Z7ey2cBKql4DrV51v2fPmFXgjPKoXDAdyLYZC.webp",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 611,
                        "name": "Juice Extractor",
                        "slug": "juice-extractor",
                        "parent_id": 63,
                        "productCount": 23,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/9YHEYOYVRKQFZnRzlRlRQ3JMNoS92MO49WjIR6wl.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 612,
                        "name": "Milkshake Maker",
                        "slug": "milkshake-maker",
                        "parent_id": 63,
                        "productCount": 7,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pKy7zhsmuPU4tRLyeSToCyEWKCsqDYU1AOiIL6rD.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 613,
                        "name": "Citrus Squeezer",
                        "slug": "citrus-squeezer",
                        "parent_id": 63,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/q2XpScrf0ERapEGtadJD2hIUScZ4qvy03Je0HaE0.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 993,
                        "name": "Frozen Drink Machine",
                        "slug": "frozen-drink-machine",
                        "parent_id": 63,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/l22gGjYojJNU6YXYkHZadcWE4467Yrnji5ANUFtE.png",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 994,
                        "name": "Juice Dispenser",
                        "slug": "juice-dispenser",
                        "parent_id": 63,
                        "productCount": 4,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/0rVJwuTG68kCovns4nki4XS792MdeFNtSgAXIhqr.png",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 197,
                        "name": "Granita \/ Slushy Machines",
                        "slug": "granita-slushy-machines",
                        "parent_id": 63,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sM2AU0LuZofuD8abNPdWSfU1bO2WsfrS4WjOyfs1.png",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1004,
                        "name": "Underbar Equipment",
                        "slug": "underbar-equipment",
                        "parent_id": 63,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/j4u4DUjxC8TafETCsFzFqhnHshNBjbePC0paRuf0.png",
                        "order": 28,
                        "children": [
                            {
                                "id": 1003,
                                "name": "Underbar Ice Bin and Cocktail Unit",
                                "slug": "underbar-ice-bin-cocktail-unit",
                                "parent_id": 1004,
                                "productCount": 1,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/PYbYlE2qyKqIUeSly9VZjX87ynUhLBNHYJj4ytpy.png",
                                "order": 2,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 1005,
                                "name": "Underbar Glass Rack Storage",
                                "slug": "underbar-glass-rack-storage",
                                "parent_id": 1004,
                                "productCount": 1,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/01GNfU4w09nwETo7zR0KPwDFXVIbG49E2RZpJtKY.png",
                                "order": 3,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 1081,
                                "name": "Underbar Blender Stations",
                                "slug": "underbar-blender-stations",
                                "parent_id": 1004,
                                "productCount": 1,
                                "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/HED28COaMWYw86zfxvfhT29wRwegJrgasbXrERNI.png",
                                "order": 4,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 189,
                        "name": "Beverage Equipment Parts",
                        "slug": "beverage-equipment-parts",
                        "parent_id": 63,
                        "productCount": 21,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/beverage-equipment-parts.webp",
                        "order": 29,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1079,
                        "name": "Beverage Dispensing Systems",
                        "slug": "beverage-dispensing-systems",
                        "parent_id": 63,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Su33wUF0zx17pDxZezFYbnEbdKPohVmmUkQ8hNXK.png",
                        "order": 30,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 595,
                "name": "Commercial Shelving",
                "slug": "commercial-shelving",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/8parGVC2s1j9IuBIVhXrW1Nb9lRADIuPBmDDd7z8.png",
                "order": 9,
                "children": [
                    {
                        "id": 599,
                        "name": "Chrome Wire Shelving",
                        "slug": "chrome-wire-shelving",
                        "parent_id": 595,
                        "productCount": 98,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/wg40g1Wku2ZL9LR31lPgqo1nDd0xsJ9HPC0CmKXL.webp",
                        "order": 14,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 598,
                        "name": "Green Epoxy Shelving",
                        "slug": "green-epoxy-shelving",
                        "parent_id": 595,
                        "productCount": 72,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Pe0GLHbYPzVyvOJ1PEj6dCJgqOx24Zkr1BMVqlV4.webp",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 597,
                        "name": "Wire Shelving",
                        "slug": "wire-shelving",
                        "parent_id": 595,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/bU72Z6osWHEqN6t0WWauKeze12xp0eph2X7n6Dln.webp",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 596,
                        "name": "Sheet Pan Rack",
                        "slug": "sheet-pan-rack",
                        "parent_id": 595,
                        "productCount": 24,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/k8bOTmvbgDo8mkXe2HC0LAYsvIC7Mxtd8R40qJqG.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1074,
                        "name": "Wall Mounted Shelving",
                        "slug": "wall-mounted-shelving",
                        "parent_id": 595,
                        "productCount": 3,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/JR7z8cDLK8MplM500eX5K31FErEAKuU3Marqe2Iu.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 40,
                "name": "Commercial Cooking Equipment",
                "slug": "commercial-cooking-equipment",
                "parent_id": 1,
                "productCount": 2,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cooking-equipment-1.png",
                "order": 10,
                "children": [
                    {
                        "id": 126,
                        "name": "Commercial Fryer",
                        "slug": "commercial-fryer",
                        "parent_id": 40,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/hC9MOAKoFen1FH2dVKDwiPQ06Eh53kWciBwR0ZXn.webp",
                        "order": 13,
                        "children": [
                            {
                                "id": 539,
                                "name": "Commercial Gas Fryer",
                                "slug": "commercial-gas-fryer",
                                "parent_id": 126,
                                "productCount": 55,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/0BwGoac9ljLnRVr4zBo0R8kq3llYcMfUrqiiGgxI.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 541,
                                "name": "Fryer Basket",
                                "slug": "fryer-basket",
                                "parent_id": 126,
                                "productCount": 40,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/VqTCwK2otnwESSiRU9kvkwDLgMFjRSZAshOYCav5.webp",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 949,
                                "name": "Pressure Fryer",
                                "slug": "pressure-fryer",
                                "parent_id": 126,
                                "productCount": 10,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/PO3Sm5lqaOBrEr9jTB6KhUf6K738J8jOsnaOsZ4Y.png",
                                "order": 12,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 540,
                                "name": "Commercial Electric Fryer",
                                "slug": "commercial-electric-fryer",
                                "parent_id": 126,
                                "productCount": 13,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/dauWVojNJc2YHEQLLInWIPv7ZgKBwPiUfoqS8Qjz.png",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 547,
                        "name": "Rice Cookers \/ Warmers",
                        "slug": "rice-cookers-rice-warmers",
                        "parent_id": 40,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/O781bmQtbF8DwKLbhNskgZ0ulWLied4W3Rz0Hjt5.webp",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 124,
                        "name": "Commercial Grill & Griddle",
                        "slug": "commercial-grill-commercial-griddle",
                        "parent_id": 40,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/A15HYlm3xZ2Y8zmT5ZfY5MNSG31lJjcgMbYtwNEz.webp",
                        "order": 18,
                        "children": [
                            {
                                "id": 534,
                                "name": "Gas Griddle",
                                "slug": "gas-griddle",
                                "parent_id": 124,
                                "productCount": 56,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/77pW9Lz5cSVB6gUgj8HqeMxE6HFJMfnhG2wKLdUT.webp",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 535,
                                "name": "Electric Griddle",
                                "slug": "electric-griddle",
                                "parent_id": 124,
                                "productCount": 9,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/VPaOf9aHKbSTnzMx3bjkjihMq14MNkVjyMKsueL0.webp",
                                "order": 12,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 536,
                                "name": "Charbroiler",
                                "slug": "charbroiler",
                                "parent_id": 124,
                                "productCount": 33,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/LCGPmsG7Rm5bfxKN93riwqeia7RjrC85IP589lCM.png",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 537,
                                "name": "Sandwich Press & Panini Grill",
                                "slug": "sandwich-press-panini-grill",
                                "parent_id": 124,
                                "productCount": 25,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/BcFsTqfBK51gvSz5pEHmdsGtrVno3Gn8Ifjond8G.webp",
                                "order": 14,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 130,
                        "name": "Commercial Toaster",
                        "slug": "commercial-toaster",
                        "parent_id": 40,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/BWOZW8lxEAjib5Xrq2xjFg032svd3toEun9orD1Q.webp",
                        "order": 19,
                        "children": [
                            {
                                "id": 544,
                                "name": "Conveyor Toaster",
                                "slug": "conveyor-toaster",
                                "parent_id": 130,
                                "productCount": 6,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/nrmi6dr6o7jxbR4qf324xvrtg0CBMpXQ95OxP93J.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 545,
                                "name": "Pop-Up Toaster",
                                "slug": "pop-up-toaster",
                                "parent_id": 130,
                                "productCount": 13,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/pZasJVbRsSCgNjhX3G2axsiOo4XoKDDydAb8KhI7.png",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 123,
                        "name": "Commercial Range",
                        "slug": "commercial-range",
                        "parent_id": 40,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yMnGmozvPxAK7LtKRx5NKmKbONwF5cQvZKuyM6hB.webp",
                        "order": 20,
                        "children": [
                            {
                                "id": 528,
                                "name": "Commercial Gas Range",
                                "slug": "commercial-gas-range",
                                "parent_id": 123,
                                "productCount": 44,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/NcM5deYx6RFzXoX9dztUpwoXa9BLluLfnjUwpTbC.webp",
                                "order": 17,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 530,
                                "name": "Countertop Gas Range",
                                "slug": "countertop-gas-range",
                                "parent_id": 123,
                                "productCount": 18,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/8BCQdt70t4ecigz4lm5V2rkjHZihkMDyZrZpHg80.webp",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 532,
                                "name": "Induction Range",
                                "slug": "induction-range",
                                "parent_id": 123,
                                "productCount": 5,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/vaQtRer6uQbnS3GeNF8vgcUrrUMP9hu1oPuuKnq2.webp",
                                "order": 20,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 957,
                                "name": "Portable Gas Ranges",
                                "slug": "portable-gas-ranges",
                                "parent_id": 123,
                                "productCount": 3,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/y868iBlhxaLpWfdFUBHpbg1vwpSrqkfa98O3ArnX.png",
                                "order": 22,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 533,
                                "name": "Gas And Electric Range Parts and Accessories",
                                "slug": "gas-electric-cooker-accessories",
                                "parent_id": 123,
                                "productCount": 4,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/QKpbqNrx7abBzg7d8v9gQl9SUAzdhOypJkvBoM5H.webp",
                                "order": 23,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 898,
                                "name": "Stock Pot Range",
                                "slug": "stock-pot-range",
                                "parent_id": 123,
                                "productCount": 16,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/kuKVvzE3jGHlxUXo6Pan9VXg87EeMFJi9D1IJ5uF.webp",
                                "order": 24,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 531,
                                "name": "Countertop Electric Ranges and Hot Plates",
                                "slug": "countertop-electric-ranges-hot-plates",
                                "parent_id": 123,
                                "productCount": 13,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/dLFbQxy1Kog0eiHxFgvmxvhegpr73NDF3FM4a08H.webp",
                                "order": 25,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 996,
                        "name": "Waffle Maker",
                        "slug": "waffle-maker",
                        "parent_id": 40,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/u2w5oqlFj0zBqiGUKc2paivaep36sAmGaAvHBsSk.png",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 136,
                        "name": "Cheese Melters",
                        "slug": "cheese-melter",
                        "parent_id": 40,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cheese-melter-1.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 129,
                        "name": "Salamander Broiler",
                        "slug": "salamander-broiler",
                        "parent_id": 40,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/salamander-1.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 998,
                        "name": "Exhaust Hood",
                        "slug": "exhaust-hood",
                        "parent_id": 40,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/5EQBl397CR9eCNqhbgkbgr4EM7OTZpvBFZj8Zgx9.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1073,
                        "name": "Air Curtain",
                        "slug": "air-curtain",
                        "parent_id": 40,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/dzLTXD9C6z64Va7HbpN2TxILK6DAxFyultvwh0SM.png",
                        "order": 28,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1082,
                        "name": "Gyro Machine",
                        "slug": "gyro-machine",
                        "parent_id": 40,
                        "productCount": 3,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/AC0kivMGThHpwnaxHnFuY0TBxbkz3dk9QtWeDF0W.png",
                        "order": 29,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 42,
                "name": "Food Prep Equipment",
                "slug": "food-prep-equipment",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/food-preparation-equipment-1.png",
                "order": 11,
                "children": [
                    {
                        "id": 946,
                        "name": "Food Preparation Equipment Parts & Accessories",
                        "slug": "food-preparation-equipment-parts-accessories",
                        "parent_id": 42,
                        "productCount": 26,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/zZ36oAgjwrOXIoqbMU2KTZFJnqgxpQKhy56cKagC.png",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 139,
                        "name": "Commercial Food Processors",
                        "slug": "commercial-food-processors",
                        "parent_id": 42,
                        "productCount": 85,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tmAc5pD0M6lOqTRku6dy0okCJ8dfY9cFwxZlYwiO.webp",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 150,
                        "name": "Meat Processing Equipment",
                        "slug": "meat-processing-equipment",
                        "parent_id": 42,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/dZF0Oq3m7QnUiB5wE8wg4UcRubHJW3bVfxa20C55.webp",
                        "order": 16,
                        "children": [
                            {
                                "id": 582,
                                "name": "Meat Grinders & Choppers",
                                "slug": "meat-grinders-meat-choppers",
                                "parent_id": 150,
                                "productCount": 11,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/vOzxG1k4lr8Hr0AKEXh2VqmC9ofXiSBbScnxDcNM.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 581,
                                "name": "Meat Slicer",
                                "slug": "meat-slicer",
                                "parent_id": 150,
                                "productCount": 15,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/rYlcaZomfFHrwCy0dNRGyvQMSULUoEWYrDbfbfBr.webp",
                                "order": 9,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 585,
                                "name": "Meat and Bone Saws",
                                "slug": "meat-bone-saws",
                                "parent_id": 150,
                                "productCount": 1,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/CzW8U9lI7VnxiU2gGnGHMlkpJLJgASg4LqoiYTjo.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 152,
                        "name": "Planetary Mixer",
                        "slug": "planetary-mixer",
                        "parent_id": 42,
                        "productCount": 23,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/52uk7DiasaVgD2aaeoOFYf10I8OIMAW1kOo9CXDL.webp",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 144,
                        "name": "Commercial Blender",
                        "slug": "commercial-blender",
                        "parent_id": 42,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tfvtl2dVHKhFB94PPRGF3TctwlJer6SosTctHKMg.webp",
                        "order": 18,
                        "children": [
                            {
                                "id": 556,
                                "name": "Immersion Blender",
                                "slug": "immersion-blender",
                                "parent_id": 144,
                                "productCount": 84,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/XGZN8eWRTKSpohgSicZNFUbhZ733smDhLF66mGCj.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 557,
                                "name": "Blender Parts",
                                "slug": "blender-parts",
                                "parent_id": 144,
                                "productCount": 89,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/too95Qzg2SppNtlMYyN574Ljxc2fUa3tfTkFK4fO.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 555,
                                "name": "Food & Drink Blender",
                                "slug": "food-drink-blenders",
                                "parent_id": 144,
                                "productCount": 36,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/VjPlg07lCmHivKOE5b2tqHLXR7rfJpE8z2yXPbme.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 147,
                        "name": "Dough Processing Equipment",
                        "slug": "dough-processing-equipment",
                        "parent_id": 42,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FUat2Az9SkCc6vmD2bPveyi6wEj2KbnFZq5A85oo.webp",
                        "order": 19,
                        "children": [
                            {
                                "id": 559,
                                "name": "Dough Divider",
                                "slug": "dough-divider",
                                "parent_id": 147,
                                "productCount": 13,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/3YG58JsaJfGPZruEtUbn8kKYHLak5RBQRN9LIdeS.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 558,
                                "name": "Dough Sheeter",
                                "slug": "dough-sheeter",
                                "parent_id": 147,
                                "productCount": 12,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/33wLonXuefe1olTuBy0yYt3UOyvhCq8d7dut6sMI.webp",
                                "order": 12,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 560,
                                "name": "Dough Rounder",
                                "slug": "dough-rounder",
                                "parent_id": 147,
                                "productCount": 4,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/f7GCTcjWHzvbzgKJOOf4xHZD6IOU8mWIlxClMOEB.webp",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 562,
                                "name": "Dough Mixer",
                                "slug": "dough-mixer",
                                "parent_id": 147,
                                "productCount": 18,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/eAuNNLcPdA0OsO9d4XPkhtMbTIKnenXECsGg7pJF.webp",
                                "order": 14,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 563,
                                "name": "Dough Moulders",
                                "slug": "dough-moulders",
                                "parent_id": 147,
                                "productCount": 2,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/zrwRxFJZZKAEVG6fpsTquLu1YYWB18baFFrj8Xen.webp",
                                "order": 15,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 154,
                        "name": "Commercial Scale",
                        "slug": "commercial-scale",
                        "parent_id": 42,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/aeQyWGPHRioA5LSndRWowV5GPEcCWohOBAi5Jv8E.webp",
                        "order": 20,
                        "children": [
                            {
                                "id": 590,
                                "name": "Digital Portion Scale",
                                "slug": "digital-portion-scale",
                                "parent_id": 154,
                                "productCount": 35,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/t6F6BQt8clUNhpk2wuYxrGKGDk3069MOsgLxgMqU.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 591,
                                "name": "Mechanical Portion Control Scale",
                                "slug": "mechanical-portion-control-scale",
                                "parent_id": 154,
                                "productCount": 16,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/Oor0TsCtlliOp8Vgm9HCElpYtMRmkmmHPmgJ75jc.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 589,
                                "name": "Shipping and Receiving Scale",
                                "slug": "shipping-receiving-scale",
                                "parent_id": 154,
                                "productCount": 6,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/NBbUXNIK6PuTkTtfz20lCLKpIoDqpCtVt9j6IpV6.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 62,
                "name": "Commercial Oven",
                "slug": "commercial-oven",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/commercial-ovens-1.png",
                "order": 12,
                "children": [
                    {
                        "id": 604,
                        "name": "Countertop Convection Oven",
                        "slug": "countertop-convection-oven",
                        "parent_id": 62,
                        "productCount": 20,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/GuO94PZI6qNtNWZPVNEjlVvp5JrtKyuqGH3SQhBf.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 175,
                        "name": "Commercial Pizza Oven",
                        "slug": "commercial-pizza-oven",
                        "parent_id": 62,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DQOEDICxpoAJISWXgvGDElmrIsxMemwTfZOrRxPD.webp",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 179,
                        "name": "Deck Oven",
                        "slug": "deck-oven",
                        "parent_id": 62,
                        "productCount": 32,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/StyyRQoOiWMleZUno4kjCrBK25Rv0RuqJT6n9eeH.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 180,
                        "name": "Commercial Convection Oven",
                        "slug": "commercial-convection-oven",
                        "parent_id": 62,
                        "productCount": 13,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/YpZKpSs1IwOhP4GuCQtDHCJBAVu8UGUAZsKZX1Du.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 501,
                        "name": "High Speed Oven",
                        "slug": "high-speed-oven",
                        "parent_id": 62,
                        "productCount": 4,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/HYIXYPi0uTIQcKY8CwA2aMcMj2prCV7FDwXclCL0.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 606,
                        "name": "Commercial Microwave Oven",
                        "slug": "commercial-microwave-oven",
                        "parent_id": 62,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/8rEBCkLgu2u0UuwAWTAGWF3tpdmHs9FqVJxBp7uf.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 956,
                        "name": "Tandoor Oven",
                        "slug": "tandoor-oven",
                        "parent_id": 62,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TCtnjcOC1MxKMG5gf7vPAfzGZzCXPvVL2W5DdPS8.png",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1002,
                        "name": "Conveyor Oven",
                        "slug": "conveyor-oven",
                        "parent_id": 62,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/JECEznLbfDLfkfkhAVrCPbooXmnTocZRtgZF17dX.webp",
                        "order": 31,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 605,
                        "name": "Ovens Parts & Accessories",
                        "slug": "oven-parts-accessories",
                        "parent_id": 62,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TinWo2JJ4q4toppJadbOxrSTx59uHS7oqnrsRfFf.webp",
                        "order": 32,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1075,
                        "name": "Combination Oven",
                        "slug": "combination-oven",
                        "parent_id": 62,
                        "productCount": 2,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/MaOUt2KshlTmvh8aKM7kO7nV0opDlS1M0nZjE8LU.webp",
                        "order": 33,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 64,
                "name": "Food Display Case And Merchandiser",
                "slug": "food-display-case-merchandiser",
                "parent_id": 1,
                "productCount": 1,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/food-warmer-holding-equipment.png",
                "order": 13,
                "children": [
                    {
                        "id": 213,
                        "name": "Food Warmers and Holding Equipment",
                        "slug": "food-warmers-food-holding-equipment",
                        "parent_id": 64,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/oGz27uRr3SWjluUYPsxKSyBywg0f2yEbS8npDYpD.webp",
                        "order": 9,
                        "children": [
                            {
                                "id": 616,
                                "name": "Countertop Food Warmer",
                                "slug": "countertop-food-warmer",
                                "parent_id": 213,
                                "productCount": 15,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/alztBWTxB03ggsziI6raeqlfQW16e4aG1AJhIvDY.webp",
                                "order": 20,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 621,
                                "name": "Heated Shelf Food Warmer",
                                "slug": "heated-shelf-food-warmer",
                                "parent_id": 213,
                                "productCount": 10,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sP7SL7tBwgsgx4isp5RLqksdkBJNVUVFNuJCaArP.webp",
                                "order": 21,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 896,
                                "name": "Holding and Proofing Cabinet",
                                "slug": "holding-proofing-cabinet",
                                "parent_id": 213,
                                "productCount": 120,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/lik33g0A82c8ycmbs4aUyT8t1nYS0X3riKp8Qh1K.webp",
                                "order": 22,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 997,
                                "name": "Condiment, Topping & Sauce Warmer",
                                "slug": "condiment-topping-sauce-warmer",
                                "parent_id": 213,
                                "productCount": 2,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/YP1rl36houneRwo1WSDWY0XdFxSAh0PQihL01t7R.webp",
                                "order": 31,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 1012,
                                "name": "Drop-In Hot Food Well",
                                "slug": "drop-in-hot-food-well",
                                "parent_id": 213,
                                "productCount": 5,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/3BVWQoaRKJvzDoSWyG2yPvq4Fn4EWQnCOQ27DXcJ.webp",
                                "order": 32,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 618,
                                "name": "Strip Warmer",
                                "slug": "strip-warmer",
                                "parent_id": 213,
                                "productCount": 1,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7UgOa4iIiJlrdK7dQ6VRxXIXar6hKzFLucMOrQYQ.webp",
                                "order": 33,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 207,
                        "name": "Commercial Popcorn Equipment",
                        "slug": "commercial-popcorn-equipment",
                        "parent_id": 64,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/40FTEGYdpUNPuRmclMhcRBF52jpLLfyIAyCzVlQp.webp",
                        "order": 11,
                        "children": [
                            {
                                "id": 629,
                                "name": "Popcorn Machine",
                                "slug": "popcorn-machine",
                                "parent_id": 207,
                                "productCount": 13,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/tqq0p8Gk82kQpHY7okT7zEDctiM6nP4ivYta5IIU.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 630,
                                "name": "Popcorn Cart & Display Stand",
                                "slug": "popcorn-cart-popcorn-display-stand",
                                "parent_id": 207,
                                "productCount": 6,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/GGzH1er5wypZ3qttW3hExAoE9DMQVvRNBnnvUiPz.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 211,
                        "name": "Hot Food Display Case",
                        "slug": "hot-food-display-case",
                        "parent_id": 64,
                        "productCount": 12,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/3SECaFn1DMAUqJbEVrnKfxqOHPLCttZKWnSeFcku.webp",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 205,
                        "name": "Cotton Candy Machine",
                        "slug": "cotton-candy-machine",
                        "parent_id": 64,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/VYzFprNYeCdQ1IxQBCwwOQmy83h5I5nMJtUkebbG.webp",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 202,
                        "name": "Snow Cone Equipment",
                        "slug": "snow-cone-equipment",
                        "parent_id": 64,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/snow-cone-equipment.webp",
                        "order": 14,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 65,
                "name": "Commercial Dishwasher",
                "slug": "commercial-dishwasher",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/commercial-dishwashers-1.png",
                "order": 14,
                "children": [
                    {
                        "id": 218,
                        "name": "Commercial Pot And Pan Washer",
                        "slug": "commercial-pot-pan-washer",
                        "parent_id": 65,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Zvk9gGJMu7BzJ9mv0x09nFgKVaTNnT6Du2T2dtBD.webp",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 220,
                        "name": "Commercial Upright Dishwasher",
                        "slug": "commercial-upright-dishwasher",
                        "parent_id": 65,
                        "productCount": 58,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/lwKd46iaAdfEo9MnL8rGS5g4KwV68jjMVIkGQxrj.webp",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 222,
                        "name": "Commercial Glasswasher",
                        "slug": "commercial-glasswasher",
                        "parent_id": 65,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/zJcMSA0YUkz7Y4qVTgFDwncvgBkiuBoxZ4dW4xjq.webp",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 224,
                        "name": "Conveyor Dishwasher",
                        "slug": "conveyor-dishwasher",
                        "parent_id": 65,
                        "productCount": 21,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/t8Lx16GRFnmG1KB2ISx5BonDL64Ll03i6d9T9tNi.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 227,
                        "name": "Undercounter Dishwasher",
                        "slug": "undercounter-dishwasher",
                        "parent_id": 65,
                        "productCount": 20,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/qCGxs846AYHJlypjGmyeTrhK7oZTrBlsVbqVHCb0.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1007,
                        "name": "Dish Cabinet",
                        "slug": "dish-cabinet",
                        "parent_id": 65,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/CtVzhdBSmcJ50b0GcRD1iMQaN8ABCbYySEk4SL0P.webp",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1006,
                        "name": "Dish Tables",
                        "slug": "dish-tables",
                        "parent_id": 65,
                        "productCount": 4,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2S9mo9NxEVe7pjOGhxgbmbuY95AZEr2XzkTwIwCw.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 502,
                "name": "Commercial Sink",
                "slug": "commercial-sink",
                "parent_id": 1,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/XqlRp4yfl3qRmM1ErtikeO0IPhQN9t1sbOZvnO51.webp",
                "order": 21,
                "children": [
                    {
                        "id": 503,
                        "name": "Portable Sink",
                        "slug": "portable-sink",
                        "parent_id": 502,
                        "productCount": 6,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/raKkFtdGaIkQKtkrXYNH42hV8w76tNkWQD6sbz2P.webp",
                        "order": 0,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1011,
                        "name": "3 Compartment Sink",
                        "slug": "3-compartment-sink",
                        "parent_id": 502,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/lN2wVk9axbZnaZIEWT3K9gWY5v20EtuCOo8lxi9n.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1009,
                        "name": "Hand Wash Sink",
                        "slug": "hand-wash-sink",
                        "parent_id": 502,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/jvAN8NxbAODM7AKixSf5NBawwn9rS6VUc4lwk715.webp",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1008,
                        "name": "Underbar Sink",
                        "slug": "underbar-sink",
                        "parent_id": 502,
                        "productCount": 7,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/g0jQxdko0611vLcn78gw8xoFvNHKAe3MI2xdzDDT.webp",
                        "order": 8,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1076,
                        "name": "1 Compartment Sink",
                        "slug": "1-compartment-sink",
                        "parent_id": 502,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/W6SYVxICRTmQz1DJddZUay4EEmKJydmikwzUeMTB.png",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1077,
                        "name": "Faucet, Sink & Drain Accessories",
                        "slug": "faucet-sink-drain-accessories",
                        "parent_id": 502,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/xRxGPEDEIulzWVoLe23NhC52T78lGptEoVhtpj82.png",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 44,
                "name": "Commercial Work Tables",
                "slug": "commercial-work-tables",
                "parent_id": 1,
                "productCount": 1,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Lv3mKoqYVkq45EKifhOPqQGCNh4bdSThNUZ0ETk5.webp",
                "order": 24,
                "children": [
                    {
                        "id": 1010,
                        "name": "Sink Table",
                        "slug": "sink-table",
                        "parent_id": 44,
                        "productCount": 19,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/E9y4RbRv0IFuiqME1I8WuMdocr3Q7jUSciO4seU4.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 592,
                        "name": "Stainless Steel Work Tables with Undershelf",
                        "slug": "stainless-steel-work-tables-undershelf",
                        "parent_id": 44,
                        "productCount": 369,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/q20YPC1uynLH5zRWgJftcfhxRfboOsiiQsf3RoOU.webp",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 45,
        "name": "Refrigeration",
        "slug": "refrigeration",
        "parent_id": 0,
        "productCount": 1,
        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/refrigeration.png",
        "order": 2,
        "children": [
            {
                "id": 46,
                "name": "Commercial Refrigerator",
                "slug": "commercial-refrigerator",
                "parent_id": 45,
                "productCount": 1,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/commercial-refrigerator-3.png",
                "order": 0,
                "children": [
                    {
                        "id": 52,
                        "name": "Bar Refrigeration",
                        "slug": "bar-refrigeration",
                        "parent_id": 46,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/4X8dVB3Z0XGdxthmHwOmvBNyGdKL1EemGpWlROJc.webp",
                        "order": 5,
                        "children": [
                            {
                                "id": 57,
                                "name": "Glass Chillers and Frosters",
                                "slug": "glass-chillers-glass-frosters",
                                "parent_id": 52,
                                "productCount": 25,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/glass-chillers-and-frosters.webp",
                                "order": 3,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 58,
                                "name": "Bottle Cooler",
                                "slug": "bottle-cooler",
                                "parent_id": 52,
                                "productCount": 71,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/bottle-coolers-1.webp",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 569,
                                "name": "Back Bar Cooler",
                                "slug": "back-bar-cooler",
                                "parent_id": 52,
                                "productCount": 288,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/LjhWMScTX358VD5d19e2TD6thDDawm28Jf97UiFY.webp",
                                "order": 12,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 570,
                                "name": "Beer Dispenser",
                                "slug": "beer-dispenser",
                                "parent_id": 52,
                                "productCount": 143,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/a0yzXuY1UN0Jl8ViE8GwSHk7vRdo53MPcTAfQyvP.webp",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 54,
                        "name": "Merchandiser Refrigerator",
                        "slug": "merchandiser-refrigerator",
                        "parent_id": 46,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rsY7uiVbLJjjnE6C91R2Y8qyfCa4W0Acac0QGiXc.webp",
                        "order": 6,
                        "children": [
                            {
                                "id": 574,
                                "name": "Commercial Merchandiser Refrigerator",
                                "slug": "commercial-merchandiser-refrigerator",
                                "parent_id": 54,
                                "productCount": 207,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/r9D9zMNyReXGIBK6aPIdjr5NGaWhnr6SSmSwNrjd.webp",
                                "order": 14,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 575,
                                "name": "Air Curtain Merchandiser",
                                "slug": "air-curtain-merchandiser",
                                "parent_id": 54,
                                "productCount": 287,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/x3JX2xxd4apffROpTbZyELa1i10LtHoSLAOQGDl8.webp",
                                "order": 15,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 577,
                                "name": "Countertop Merchandiser Refrigerator",
                                "slug": "countertop-merchandiser-refrigerator",
                                "parent_id": 54,
                                "productCount": 20,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/wMb8lrDstQEVCPBMpjNEQqISApjIfc4JMHO5Ton2.webp",
                                "order": 16,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 579,
                                "name": "Floral Cooler",
                                "slug": "floral-cooler",
                                "parent_id": 54,
                                "productCount": 6,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/MxE7xkOhByZAqJMq24sgUbgE3kbqDtx22xU2xsMt.webp",
                                "order": 17,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 907,
                                "name": "Dry and Refrigerated Bakery Display Case",
                                "slug": "dry-refrigerated-bakery-display-case",
                                "parent_id": 54,
                                "productCount": 46,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/ZhHm9sRdca1QLb7KljsjB0ckN7ByDkYXoiHx15MG.webp",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 55,
                        "name": "Milk Cooler",
                        "slug": "milk-cooler",
                        "parent_id": 46,
                        "productCount": 63,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/jnBDPc5A34QkT4R9oOJvSUZhdD0c05WZj2Do5mPh.webp",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 56,
                        "name": "Wine Cooler",
                        "slug": "wine-cooler",
                        "parent_id": 46,
                        "productCount": 17,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pZnTcWdMEKsZvo1SbhOHcGSvPlvFYwDZu7PUuBu8.webp",
                        "order": 8,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 165,
                        "name": "Combination Reach-In Refrigerators & Freezers",
                        "slug": "combination-reach-in-refrigerators-freezers",
                        "parent_id": 46,
                        "productCount": 47,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/taXCwkacNhAxXgxB5oUyae3ZSEKcCUm8YZSPSmVw.webp",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 47,
                        "name": "Chef Base Refrigerator",
                        "slug": "chef-base-refrigerator",
                        "parent_id": 46,
                        "productCount": 90,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/nmPCnBh9WmsEqsny68peDdhqiCmzpp2AmkiNUD6V.webp",
                        "order": 21,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 48,
                        "name": "Reach In Refrigerator",
                        "slug": "reach-in-refrigerator",
                        "parent_id": 46,
                        "productCount": 478,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/E7vOjF8DGLifYgWhSXTS7RG5LWDvlVVqzQrLCVpD.webp",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 49,
                        "name": "Worktop Refrigerator",
                        "slug": "worktop-refrigerator",
                        "parent_id": 46,
                        "productCount": 161,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/v9OFWJqHqdtf2jKhh7NCALOrJaVoyNBQDGUFCKzd.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 50,
                        "name": "Undercounter Refrigerator",
                        "slug": "undercounter-refrigerator",
                        "parent_id": 46,
                        "productCount": 227,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2BhgxEE4QMurHnllGnuF0B5OH5awT9gVbf5HHqtE.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 51,
                        "name": "Prep Table",
                        "slug": "prep-table",
                        "parent_id": 46,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/67qk4c5gwUe1pC2xnhap7Ly3QYhYlRjEqVf89NmU.webp",
                        "order": 25,
                        "children": [
                            {
                                "id": 567,
                                "name": "Sandwich And Salad Prep Table",
                                "slug": "sandwich-prep-table-salad-prep-table",
                                "parent_id": 51,
                                "productCount": 499,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/GCUwUsuGbLbQuFPHotIcBbS5YC6Q2QTPRnICR0qC.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 568,
                                "name": "Pizza Prep Table",
                                "slug": "pizza-prep-table",
                                "parent_id": 51,
                                "productCount": 91,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/1AnQBJPhv5vVl4BxEbWfQbD6AVJoSfYjOiCMzv6P.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 167,
                        "name": "Combination Undercounter Refrigerators & Freezers",
                        "slug": "combination-undercounter-refrigerators-freezers",
                        "parent_id": 46,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/CtOS6IVlRGd4Yb3VyvAkvZCEZlvxkY2osa3BZE7x.png",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 59,
                        "name": "Refrigerators Parts",
                        "slug": "refrigerator-parts",
                        "parent_id": 46,
                        "productCount": 85,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/0NyzSy2TLRk89kiygLzBcBnfiY42jlOaWlM9t1ZG.webp",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 87,
                "name": "Ice Machine",
                "slug": "ice-machine",
                "parent_id": 45,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/commercial-ice-equipment.png",
                "order": 7,
                "children": [
                    {
                        "id": 140,
                        "name": "Ice Machine Bins And Dispensers",
                        "slug": "commercial-ice-machine-bins-commercial-ice-dispensers",
                        "parent_id": 87,
                        "productCount": 58,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ijEldJCa98LLLPPFg1Nm3xlZ36x5np3P7rlCiOU6.webp",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 142,
                        "name": "Commercial Ice And Water Dispenser",
                        "slug": "commercial-ice-water-dispenser",
                        "parent_id": 87,
                        "productCount": 25,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/MdXAtrn2DCLx7X3Ml949MJCmDeyFcP2NI4cHgB8S.webp",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 143,
                        "name": "Remote Condenser Ice Machine",
                        "slug": "remote-condenser-ice-machine",
                        "parent_id": 87,
                        "productCount": 135,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/y5itc2dZog4dmBajkTVxyEHhKxWVA0Fqbj1tkNyk.webp",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 145,
                        "name": "Water Cooled Ice Machine",
                        "slug": "water-cooled-ice-machine",
                        "parent_id": 87,
                        "productCount": 88,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/k6dQ1Bqeeur9VDJoQS4Bkpnz8GmSwprjLf89yNnD.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 149,
                        "name": "Air Cooled Ice Machine",
                        "slug": "air-cooled-ice-machine",
                        "parent_id": 87,
                        "productCount": 201,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pmpKw95njLlkWflUPi6LPzJAlrSrkcq4JfdydzNj.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 153,
                        "name": "Undercounter Ice Makers",
                        "slug": "undercounter-ice-makers",
                        "parent_id": 87,
                        "productCount": 82,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/vonlhyTyaLHwu3jNbdj8DxDnIuJZdZSVswJDj0Vm.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 138,
                        "name": "Ice Machine Parts",
                        "slug": "ice-machine-parts",
                        "parent_id": 87,
                        "productCount": 57,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ef90w4IrjmA5Rhy4ycHu98hTs3mfgzBPOAlSRSVr.png",
                        "order": 21,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 88,
                "name": "Commercial Freezer",
                "slug": "commercial-freezer",
                "parent_id": 45,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/commercial-freezers.png",
                "order": 8,
                "children": [
                    {
                        "id": 121,
                        "name": "Reach In Freezer",
                        "slug": "reach-in-freezer",
                        "parent_id": 88,
                        "productCount": 276,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/cwEO9YhkWpVIPKTw3KcHylome6SYkpmrIIy0Q9GC.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 122,
                        "name": "Worktop Freezer",
                        "slug": "worktop-freezer",
                        "parent_id": 88,
                        "productCount": 81,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/PJZQcthnVaWuZ5ES00nvsm3uOPVdSHFY5pkciXFf.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 125,
                        "name": "Undercounter Freezer",
                        "slug": "undercounter-freezer",
                        "parent_id": 88,
                        "productCount": 110,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WE4jj5PC2qC8auQM2sDoOXGli9yxHvjPH0YGpBSA.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 127,
                        "name": "Chef Base Freezer",
                        "slug": "chef-base-freezer",
                        "parent_id": 88,
                        "productCount": 20,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/B6MQDzjkGIsuWG1m3Nl2cDmUps28XMiADpupnOag.webp",
                        "order": 21,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 131,
                        "name": "Merchandiser Freezer",
                        "slug": "merchandiser-freezer",
                        "parent_id": 88,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WmAFf7EEEpDt2Y0LQC8wH9v7FdlzNMZNbEUqQGpM.webp",
                        "order": 22,
                        "children": [
                            {
                                "id": 137,
                                "name": "Ice Merchandiser",
                                "slug": "ice-merchandiser",
                                "parent_id": 131,
                                "productCount": 5,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/i7HcpmW5JkS151xZOhelCBomKa32nCbU9l0tbHpt.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 576,
                                "name": "Glass Door Merchandising Freezer",
                                "slug": "glass-door-merchandising-freezer",
                                "parent_id": 131,
                                "productCount": 90,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/b0v3FYS6jX1Au7D0eFVq5sGnsqRKIy1uKRAaJpLX.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 583,
                                "name": "Ice Cream Freezer",
                                "slug": "ice-cream-freezer",
                                "parent_id": 131,
                                "productCount": 11,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/nK7TVC7ykMLYtMRr2fg1ASsac2CEXOTwwFCX8vbD.webp",
                                "order": 9,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 586,
                                "name": "Ice Cream Dipping Cabinets",
                                "slug": "ice-cream-dipping-cabinets",
                                "parent_id": 131,
                                "productCount": 3,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ieCk1t5y4l402gETUVywFpIn0RsIUxzGSgqRup6E.png",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 584,
                                "name": "Countertop Merchandiser Freezers",
                                "slug": "countertop-merchandiser-freezers",
                                "parent_id": 131,
                                "productCount": 3,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/qKvsiEW9v6Owd1gPAhsVUUzK3DvqSRgsQS0Hg1Y0.png",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 132,
                        "name": "Chest Freezer",
                        "slug": "chest-freezer",
                        "parent_id": 88,
                        "productCount": 27,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Phn3v7Cj1vwPX0Hm6F3a0EevPn2uCDNlq4zScs4z.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 950,
                "name": "Walk-In Refrigerator",
                "slug": "walk-in-refrigerator",
                "parent_id": 45,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/L7js6I4PSMERrJNAI7X9t69R7tsCBRwxrYfv30t0.webp",
                "order": 9,
                "children": [
                    {
                        "id": 951,
                        "name": "Walk-In Coolers & Refrigerators",
                        "slug": "walk-in-coolers-refrigerators",
                        "parent_id": 950,
                        "productCount": 56,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/CGbjQmPl7udc1ryJ0gzoAynYETEDG6cl28JqZ9A2.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 952,
                        "name": "Walk-In Freezer",
                        "slug": "walk-in-freezer",
                        "parent_id": 950,
                        "productCount": 29,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2UVmsZlDZqle1mI9meQzwtqnBzWicsWJ8tcHHkyG.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 953,
                        "name": "Walk-In Cooler \/ Freezer Combo",
                        "slug": "walk-in-cooler-freezer-combo",
                        "parent_id": 950,
                        "productCount": 68,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pUHXl0obf3Tyu1LfTaHzaC3cWCfUect1UFVM79VN.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 955,
                        "name": "Walk-In Cooler Box",
                        "slug": "walk-in-cooler-box",
                        "parent_id": 950,
                        "productCount": 86,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/BmkmJtrUdt8MIQgp4IJBey0jeeMeWnPwUQ7NbX6B.webp",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 67,
        "name": "Tableware",
        "slug": "tableware",
        "parent_id": 0,
        "productCount": 4,
        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/tableware-1.png",
        "order": 3,
        "children": [
            {
                "id": 68,
                "name": "Crockery",
                "slug": "crockery",
                "parent_id": 67,
                "productCount": 4,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/crockery-1.png",
                "order": 2,
                "children": [
                    {
                        "id": 173,
                        "name": "Black Dinnerware",
                        "slug": "black-dinnerware",
                        "parent_id": 68,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Mlhfount7SNPoJtTEYrFqwO8IZxqZhdnPm9fU6Y8.webp",
                        "order": 8,
                        "children": [
                            {
                                "id": 761,
                                "name": "Black Plates",
                                "slug": "black-plates",
                                "parent_id": 173,
                                "productCount": 47,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pKRsGRb5PUv2p0dZ46QdSo9VPbNpnt3L1fzCISKQ.webp",
                                "order": 4,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 762,
                                "name": "Black Bowls",
                                "slug": "black-bowls",
                                "parent_id": 173,
                                "productCount": 28,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WIT6yYloNic58SPYrv7ooHARbEyvmp1hY9iy1Wtp.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 171,
                        "name": "Colored Rim Dinnerware",
                        "slug": "colored-rim-dinnerware",
                        "parent_id": 68,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/lS0bnh20y2PHi2s6kUrRlUCGGmtvpoiCSdvL2fYz.webp",
                        "order": 9,
                        "children": [
                            {
                                "id": 752,
                                "name": "Colored Rim Bowls",
                                "slug": "colored-rim-bowls",
                                "parent_id": 171,
                                "productCount": 121,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/nShLdXMjME3MyTsGFRutpMB955eZAddVhEvBDg4U.webp",
                                "order": 0,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 753,
                                "name": "Colored Rim Platters & Trays",
                                "slug": "colored-rim-platters-trays",
                                "parent_id": 171,
                                "productCount": 106,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/BpEuifWE8AhA9WqaeirPrKxAostjspaDxwu7dq5W.webp",
                                "order": 1,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 754,
                                "name": "Colored Rim Plates",
                                "slug": "colored-rim-plates",
                                "parent_id": 171,
                                "productCount": 139,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/vu65vaBmRRU8iJSBQmZs8FZCggyYTgzT3PyQbZzo.webp",
                                "order": 2,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 755,
                                "name": "Colored Rim Cups, Mugs & Saucers",
                                "slug": "colored-rim-cups-mugs-saucers",
                                "parent_id": 171,
                                "productCount": 57,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/94mw8jtT1FGRIxPIiqhwqosRxvS19huVkTqERUBD.webp",
                                "order": 3,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 174,
                        "name": "Matte Dinnerware",
                        "slug": "matte-dinnerware",
                        "parent_id": 68,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FVL2JynF4cwHg0Kt5Go7LmgE06tmKXw7wCYYWcnf.webp",
                        "order": 10,
                        "children": [
                            {
                                "id": 764,
                                "name": "Matte Plates",
                                "slug": "matte-plates",
                                "parent_id": 174,
                                "productCount": 58,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sHKLYFwcRFRyiJrF2rHMS2As3mCrSNLIaySJEghv.webp",
                                "order": 3,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 767,
                                "name": "Matte Cups, Mugs & Saucers",
                                "slug": "matte-cups-mugs-saucers",
                                "parent_id": 174,
                                "productCount": 9,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TWEg4Cn56hUhi9YumWU8zPWSn5sCMBOCUT0Uzb8J.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 765,
                                "name": "Matte Bowls",
                                "slug": "matte-bowls",
                                "parent_id": 174,
                                "productCount": 36,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Jojl8Bqwv1RLcKQcdrbnzWELfrWV5LRo3ttTY97v.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 176,
                        "name": "Reactive Glaze Dinnerware",
                        "slug": "reactive-glaze-dinnerware",
                        "parent_id": 68,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tfedUvI99ZEwhqpwoYa5kyDfScadsqldVHk5o16y.webp",
                        "order": 11,
                        "children": [
                            {
                                "id": 768,
                                "name": "Reactive Glaze Plates",
                                "slug": "reactive-glaze-plates",
                                "parent_id": 176,
                                "productCount": 386,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/99mBu6Xd4nBa3DJd9sK1mzCui7wm64XbVGivIOY5.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 769,
                                "name": "Reactive Glaze Bowls",
                                "slug": "reactive-glaze-bowls",
                                "parent_id": 176,
                                "productCount": 235,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/vpAB5z1a0HmpWR5aVEJjS5jIReCMbE0VjTRGaILH.webp",
                                "order": 9,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 770,
                                "name": "Reactive Glaze Platters & Trays",
                                "slug": "reactive-glaze-platters-trays",
                                "parent_id": 176,
                                "productCount": 165,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/BHIa67cY9Vm1sBrGnp80wX4ju8hc4FNUO9Jdp2Jv.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 771,
                                "name": "Reactive Glaze Cups, Mugs & Saucers",
                                "slug": "reactive-glaze-cups-mugs-saucers",
                                "parent_id": 176,
                                "productCount": 121,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/E62F0xLaHf7FHFJz8Vm0vDCBIrpcIaHC5r6zoam9.webp",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 177,
                        "name": "Rustic Dinnerware",
                        "slug": "rustic-dinnerware",
                        "parent_id": 68,
                        "productCount": 40,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/HvUyk0ZfhQsC4iy23s0RwtZO8zLVc4rKpn3K0qkJ.webp",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 172,
                        "name": "White Dinnerware",
                        "slug": "white-dinnerware",
                        "parent_id": 68,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/XiXAjSAKBnxlCzjTOJBC1xueRMIk3j1lsARChRGH.webp",
                        "order": 13,
                        "children": [
                            {
                                "id": 756,
                                "name": "White Plates",
                                "slug": "white-plates",
                                "parent_id": 172,
                                "productCount": 754,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ClgH5xMA2GirXRPuDUNgC8Rfmp0uC2sqknuUTXHc.webp",
                                "order": 4,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 757,
                                "name": "White Bowls",
                                "slug": "white-bowls",
                                "parent_id": 172,
                                "productCount": 720,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/U6JSrv7jCoAkYue2Cj4gYmcg1s1PQw0pLZRbWo8U.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 758,
                                "name": "White Platters & Trays",
                                "slug": "white-platters-white-trays",
                                "parent_id": 172,
                                "productCount": 384,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Rmjxzm4T45OIdUd2U6nAQ3Islmid53b5T1knSz9X.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 759,
                                "name": "White Cups, Mugs & Saucers",
                                "slug": "white-cups-mugs-saucers",
                                "parent_id": 172,
                                "productCount": 344,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/w559EESuoZFVBUth9kGNlIlKhnm1MqKIN9GqeCTw.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 69,
                "name": "Serveware",
                "slug": "serveware",
                "parent_id": 67,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/serveware-2.webp",
                "order": 3,
                "children": [
                    {
                        "id": 181,
                        "name": "Teaware",
                        "slug": "teaware",
                        "parent_id": 69,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/kgfBvyqRMuv65OvJMnJEugKGUVzUxOWHRF4AAcTe.webp",
                        "order": 1,
                        "children": [
                            {
                                "id": 784,
                                "name": "Teapots",
                                "slug": "teapots",
                                "parent_id": 181,
                                "productCount": 47,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/t05IKgtYTGcW1uUvq1qR3G0dMZqtxalKjNlK1ePW.webp",
                                "order": 1,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 785,
                                "name": "Creamers",
                                "slug": "creamers",
                                "parent_id": 181,
                                "productCount": 55,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/wZfMuiZEAHRHe7eE7B8Y1W8l6SOZJhNP5nJj0JHn.webp",
                                "order": 2,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 182,
                        "name": "Food Display Baskets",
                        "slug": "food-display-baskets",
                        "parent_id": 69,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/h9WZHDyG1sbBWeTkzXeQ0y2xuOKI3wxndTOP5EhW.webp",
                        "order": 2,
                        "children": [
                            {
                                "id": 788,
                                "name": "Fast Food Baskets",
                                "slug": "fast-food-baskets",
                                "parent_id": 182,
                                "productCount": 50,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/BK0DYMqsreOQlnc8sNvpzwQAysL5w4et5axbD9Oo.webp",
                                "order": 4,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 786,
                                "name": "Bread Basket",
                                "slug": "bread-basket",
                                "parent_id": 182,
                                "productCount": 29,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/40ToSZNpkiTYkCiC1LILiIkJg8p4kO91nakQqqDW.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 184,
                        "name": "Fajita Skillet & Sizzling Platter",
                        "slug": "fajita-skillet-sizzling-platter",
                        "parent_id": 69,
                        "productCount": 40,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/LvxXwMzuaK1KlKv3JOJYKHdArRykoZAU4L92cFN6.webp",
                        "order": 3,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 185,
                        "name": "Serving & Display Platters",
                        "slug": "serving-platters-display-platters",
                        "parent_id": 69,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/X3c925gHwMnrMWdLEXvw6J8krvR3gl8SvQwv9CqB.webp",
                        "order": 4,
                        "children": [
                            {
                                "id": 774,
                                "name": "China Platters & Trays",
                                "slug": "china-platters-china-trays",
                                "parent_id": 185,
                                "productCount": 223,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/3qPTYSwrFR7vweP66w578a7AJyD3kpWlubqyD2dG.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 777,
                                "name": "Compartment Platters & Trays",
                                "slug": "compartment-platters-compartment-trays",
                                "parent_id": 185,
                                "productCount": 83,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TqCgHgmzlJ2pt31KwXsCXYL43fJ9weTEozrxjYIg.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 775,
                                "name": "Metal Platters & Trays",
                                "slug": "metal-platters-trays",
                                "parent_id": 185,
                                "productCount": 45,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/L0YryotoSEHMyuNPklFAwr4r1KcqdlFLSr24mDKH.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 780,
                                "name": "Serving & Display Bowls",
                                "slug": "serving-bowls-display-bowls",
                                "parent_id": 185,
                                "productCount": 95,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Tde9wDM4PahKKLuLRKUyjlpiVXoEAgooBeYijpBE.webp",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 781,
                                "name": "Wooden Platters & Trays",
                                "slug": "wooden-platters-wooden-trays",
                                "parent_id": 185,
                                "productCount": 10,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/4v7EUbc3pjNrD11v2BJC4ZjKCbomuqrkZIMmitPI.png",
                                "order": 14,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 778,
                                "name": "Fast Food Tray",
                                "slug": "fast-food-tray",
                                "parent_id": 185,
                                "productCount": 48,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Uz98Us6S6qhbwXvjtrmkl9EXjTcBbzfdEAu3rhei.webp",
                                "order": 16,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 779,
                                "name": "Non-Skid Tray",
                                "slug": "non-skid-tray",
                                "parent_id": 185,
                                "productCount": 70,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/RuQJB0WH2lXZRXloeIp0Bw15mRiS3Ev1lhDaQwgy.webp",
                                "order": 17,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 791,
                                "name": "Bento Boxes",
                                "slug": "bento-boxes",
                                "parent_id": 185,
                                "productCount": 3,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/avFetQ4lzgu9MyADVVpmTRwi15vg5TwDZtXRIwi5.webp",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 187,
                        "name": "Ramekin Cups and Sauce Cups",
                        "slug": "ramekin-cups-sauce-cups",
                        "parent_id": 69,
                        "productCount": 422,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/I5Gyeup2lqT2P7gUCNhSVbeXvshhwWm6egXIiwQ5.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 504,
                        "name": "Creme Brulee & Souffle Dishes",
                        "slug": "creme-brulee-souffle-dishes",
                        "parent_id": 69,
                        "productCount": 20,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FSDSvjxmbLERS9doYdFWBYt4cBvFPx3z4vT4c1cG.webp",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 507,
                        "name": "Serveware Accessories",
                        "slug": "serveware-accessories",
                        "parent_id": 69,
                        "productCount": 393,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/XWxVXICOMXYzlobdmBlp3RD3pdWLwluqAdCMAoG3.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 772,
                        "name": "French Fry Holder",
                        "slug": "french-fry-holder",
                        "parent_id": 69,
                        "productCount": 34,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/udMzk9jQssRffrFPtGFhnCl4Bj0twOr0opwlMiGT.webp",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 773,
                        "name": "Molcajete & Salsa Bowl",
                        "slug": "molcajete-salsa-bowl",
                        "parent_id": 69,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/MdtuWsWGdKSwgRaRBaE0cuFvJuK04mE0ZQlcWy3j.webp",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 782,
                        "name": "Chinese Soup Spoons, Ladles, and Turners",
                        "slug": "chinese-soup-spoons-ladles-turners",
                        "parent_id": 69,
                        "productCount": 83,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/1dySnYCsnnmjtgzY0wZ4J85xndTa0CP2Gv2ZpSCb.webp",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 783,
                        "name": "Soup Mugs, Cups, and Bowls",
                        "slug": "soup-mugs-cups-bowls",
                        "parent_id": 69,
                        "productCount": 169,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Xez06W0JYNrwmpB0MzOzbqOE4YC9JLoBjAllxqBi.webp",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 912,
                        "name": "Au Gratin Dish",
                        "slug": "au-gratin-dish",
                        "parent_id": 69,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FcXzhYV5R0ImdjDXEivpIL1XA0F4VPAfTnPdoG4i.webp",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 915,
                        "name": "Taco Holders & Taco Server",
                        "slug": "taco-holders-taco-server",
                        "parent_id": 69,
                        "productCount": 19,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/mrWeT9JjcAKMgkPWOtJAkbZpg4vlsCNXzUJwVF96.webp",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1000,
                        "name": "Tortilla Warmer",
                        "slug": "tortilla-warmer",
                        "parent_id": 69,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/0zyMYhPU2xGvaQAaliMiC29OhlMEErUwzHDpt1fr.png",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 70,
                "name": "Tabletop Accessories",
                "slug": "tabletop-accessories",
                "parent_id": 67,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/tabletop-accessories-2.webp",
                "order": 4,
                "children": [
                    {
                        "id": 199,
                        "name": "Cruets and Condiments",
                        "slug": "cruets-condiments",
                        "parent_id": 70,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DRQKIgltD0FHzIPOn4aW56veWijK4DvcJMRiSEZV.webp",
                        "order": 16,
                        "children": [
                            {
                                "id": 801,
                                "name": "Oil and Vinegar Cruet",
                                "slug": "oil-vinegar-cruet",
                                "parent_id": 199,
                                "productCount": 32,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/B3S4fpsDSnfKk9m9zbnBIyJ5d7JRonRmoBrH8iXA.webp",
                                "order": 17,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 802,
                                "name": "Condiment Server",
                                "slug": "condiment-server",
                                "parent_id": 199,
                                "productCount": 65,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/xYsRQb1tYUVYAKdOORXsYbH26OawjlQLCKrI0aSR.webp",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 804,
                                "name": "Squeeze Bottle",
                                "slug": "squeeze-bottle",
                                "parent_id": 199,
                                "productCount": 41,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ndNJuzED5cJUAPyis4afqsw2NTVuZUfEeUI1Jgi0.webp",
                                "order": 19,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 800,
                                "name": "Sauce & Syrup Dispenser",
                                "slug": "sauce-syrup-dispenser",
                                "parent_id": 199,
                                "productCount": 12,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/wT1n4zx8y7kRS8WD5xJOiawvmbqcvt1LUe6u1Qbt.webp",
                                "order": 21,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 911,
                                "name": "Spice Shaker and Dredges",
                                "slug": "spice-shaker-dredges",
                                "parent_id": 199,
                                "productCount": 45,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ZdYLvIMcWVLsFTeP3hWk9aBARIhKCNY6qzMbIUAw.webp",
                                "order": 22,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 194,
                        "name": "Sugar Caddies",
                        "slug": "sugar-caddies",
                        "parent_id": 70,
                        "productCount": 35,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/mXsvydMyZVrL9H8kyV2dMCC9g93dFwtRso9q4RGj.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 794,
                        "name": "Salt and Pepper Shakers",
                        "slug": "salt-pepper-shakers",
                        "parent_id": 70,
                        "productCount": 56,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/4NVFj9DYtGjTSsIg83vsoeceZYU8RP71WOsETITC.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 807,
                        "name": "Ashtray",
                        "slug": "ashtray",
                        "parent_id": 70,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/XTC7PBTUl4S6xnxYAiKxqEGrIOr0KDvgwxTF236D.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 809,
                        "name": "Check Presenters and Server Books",
                        "slug": "check-presenters-server-books",
                        "parent_id": 70,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Tr0FhHDccvwhScn4c7hO6x06lWf0I56AuCImvYml.png",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 382,
                        "name": "Display Riser & Display Stand",
                        "slug": "display-riser-display-stand",
                        "parent_id": 70,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/V6CFTepweoaH9UK5YSGqxbaNcGXtyyZjSArk8Vn7.webp",
                        "order": 33,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 999,
                        "name": "Egg Plate & Egg Cups",
                        "slug": "egg-plate-egg-cups",
                        "parent_id": 70,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/RdRyYiuJhf7GPpIUlvaoCeq57Nhm6EHuf0qgsWaH.webp",
                        "order": 34,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 805,
                        "name": "Flatware Organizer",
                        "slug": "flatware-organizer",
                        "parent_id": 70,
                        "productCount": 29,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Zt5JgGjEsXMgwDdYug4N9S1Cv0y09keyjRHxXdZn.webp",
                        "order": 35,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 808,
                        "name": "Menu Covers & Menu Holders",
                        "slug": "menu-covers-menu-holders",
                        "parent_id": 70,
                        "productCount": 126,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/46SEMSCH9aMsn6g6dIpWZ5VscCAasAg4iwGXx22U.webp",
                        "order": 36,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 914,
                        "name": "Table Crumbers",
                        "slug": "table-crumbers",
                        "parent_id": 70,
                        "productCount": 4,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/9T24PQrzcCIpGu4MUKZol0oarNX1QTRN7KgT83vH.webp",
                        "order": 37,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 812,
                        "name": "Tabletop Tents and Tabletop Cards",
                        "slug": "tabletop-tents-tabletop-cards",
                        "parent_id": 70,
                        "productCount": 28,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Mk19y8tkCcK7vOjmbEvhk5hDRH55gQu3uG5mTkhi.webp",
                        "order": 38,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 71,
                "name": "Melamine Dinnerware",
                "slug": "melamine-dinnerware",
                "parent_id": 67,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/melamine-dinnerware-and-buffetware-2.webp",
                "order": 4,
                "children": [
                    {
                        "id": 203,
                        "name": "Melamine Platters & Trays",
                        "slug": "melamine-platters-melamine-trays",
                        "parent_id": 71,
                        "productCount": 410,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/IVyFmrbssFFOW79BLzwGpMbkcGy9hvAIxVDjYJKC.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 208,
                        "name": "Melamine Bowls",
                        "slug": "melamine-bowls",
                        "parent_id": 71,
                        "productCount": 894,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/HXJPv8SKALXSwStJvzKq6EXGTZuBzCTD9HASLKhl.webp",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 210,
                        "name": "Melamine Plates",
                        "slug": "melamine-plates",
                        "parent_id": 71,
                        "productCount": 864,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7Z1ZVfFBUPUxOtWujdTX4cjUu1B4VExlBqckoVVB.webp",
                        "order": 8,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 799,
                        "name": "Melamine Mugs, Cups and Saucers",
                        "slug": "melamine-mugs-cups-saucers",
                        "parent_id": 71,
                        "productCount": 105,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/NuP2F7r22G4pGppVKjtRDRea4Wfn4GwqrNC8L5lU.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 74,
                "name": "Glassware",
                "slug": "glassware",
                "parent_id": 67,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/glassware-3.png",
                "order": 5,
                "children": [
                    {
                        "id": 244,
                        "name": "Drinking Glasses",
                        "slug": "drinking-glasses",
                        "parent_id": 74,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/water-and-juice-glasses-1.png",
                        "order": 0,
                        "children": [
                            {
                                "id": 818,
                                "name": "Cooler Glasses",
                                "slug": "cooler-glasses",
                                "parent_id": 244,
                                "productCount": 44,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/N5HIHMFuvjXgOGGCS3noQg9pcZEqTQIeAy0iQfiy.webp",
                                "order": 4,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 820,
                                "name": "Iced Tea Glasses",
                                "slug": "iced-tea-glasses",
                                "parent_id": 244,
                                "productCount": 7,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/oYjQEfp8gYAzQZDTubEQdHRS4dVNjqpYyoPhc1yb.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 817,
                                "name": "Tumblers",
                                "slug": "tumblers",
                                "parent_id": 244,
                                "productCount": 88,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/THK9M8jfYqrrJ50VrmvJd7yZugHtvhrWGd7MmlG8.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 819,
                                "name": "Beverage Glasses",
                                "slug": "beverage-glasses",
                                "parent_id": 244,
                                "productCount": 78,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pwDkHdLygKLFYGQy3ZP8b8TuxTXUQ3eAMTUDiK6z.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 242,
                        "name": "Beer Glasses",
                        "slug": "beer-glasses",
                        "parent_id": 74,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/beer-glasses-1.png",
                        "order": 1,
                        "children": [
                            {
                                "id": 821,
                                "name": "Beer Mugs",
                                "slug": "beer-mugs",
                                "parent_id": 242,
                                "productCount": 25,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ntOU3VWj6k8mJ23sfouT18s545bMNtDRh2GEgPRb.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 824,
                                "name": "Mixing Glasses",
                                "slug": "mixing-glasses",
                                "parent_id": 242,
                                "productCount": 21,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/CwVHwMobq40tmBnegK3FHOIsxyiJRpFeu45EhQ2N.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 823,
                                "name": "Pilsner Glasses",
                                "slug": "pilsner-glasses",
                                "parent_id": 242,
                                "productCount": 36,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ornXGUgi1RJrfoKNdda0E4XUelKb2XWkSQzgwtnS.webp",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 822,
                                "name": "Pub Glasses",
                                "slug": "pub-glasses",
                                "parent_id": 242,
                                "productCount": 18,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/moENJUuw8y4jgVXBDHjjHuLHdPgnOjDTLa3Dc0YZ.webp",
                                "order": 12,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 923,
                                "name": "Schooner Glasses",
                                "slug": "schooner-glasses",
                                "parent_id": 242,
                                "productCount": 14,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/0T8aPcCGITdx8cG6IjSsDeUPHPinaqlAtgUpDL3a.webp",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 241,
                        "name": "Wine Glasses",
                        "slug": "wine-glasses",
                        "parent_id": 74,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/wine-glasses-1.png",
                        "order": 2,
                        "children": [
                            {
                                "id": 827,
                                "name": "All Purpose Wine Glasses",
                                "slug": "all-purpose-wine-glasses",
                                "parent_id": 241,
                                "productCount": 67,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sgNWfUjrG1SxvwnBgTvv8yPPzRmiGXKVBXqMEBbg.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 829,
                                "name": "Champagne Glasses",
                                "slug": "champagne-glasses",
                                "parent_id": 241,
                                "productCount": 42,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/kZfoX2nWYgwHLTt7yg25PRUYxyMeTuwQ8S21PdJZ.webp",
                                "order": 6,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 825,
                                "name": "Red Wine Glasses",
                                "slug": "red-wine-glasses",
                                "parent_id": 241,
                                "productCount": 40,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ZeF1IQjbRlvdPmGvcuuuSJ5py8CwONlxd2mDlqwF.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 826,
                                "name": "White Wine Glasses",
                                "slug": "white-wine-glasses",
                                "parent_id": 241,
                                "productCount": 57,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FgJ58INqyKSRQ1slFYVSaN356mB3KsPCqGT9LcOm.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 828,
                                "name": "Wine Glasses with Pour Lines",
                                "slug": "wine-glasses-with-pour-lines",
                                "parent_id": 241,
                                "productCount": 9,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/HHP2BlDhe89ydqDdqIU6JJsqK45Km2mn1jR9vpF9.webp",
                                "order": 9,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 240,
                        "name": "Cocktail Glasses",
                        "slug": "cocktail-glasses",
                        "parent_id": 74,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cocktail-glasses-1.png",
                        "order": 3,
                        "children": [
                            {
                                "id": 837,
                                "name": "Brandy Glasses",
                                "slug": "brandy-glasses",
                                "parent_id": 240,
                                "productCount": 6,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/uidmifONAGKx3dYwP55RCV43jnK196o9ByXdWE36.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 836,
                                "name": "Coupe Glasses",
                                "slug": "coupe-glasses",
                                "parent_id": 240,
                                "productCount": 15,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/3sLHVtRFoBcxT4Fwhe1rw4DBI94fH24uhU3pCANl.webp",
                                "order": 11,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 833,
                                "name": "Highball Glasses",
                                "slug": "highball-glasses",
                                "parent_id": 240,
                                "productCount": 35,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/mZPDf89IMuMCtAOlNGyI4kl4Vt6XSAW2sCo1EZ3i.webp",
                                "order": 13,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 835,
                                "name": "Hurricane Glasses",
                                "slug": "hurricane-glasses",
                                "parent_id": 240,
                                "productCount": 8,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/SNVFZIDsRuKAnMfNLkb5bIXsfaQCnuZfuQ8WbCkh.webp",
                                "order": 14,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 832,
                                "name": "Margarita Glasses",
                                "slug": "margarita-glasses",
                                "parent_id": 240,
                                "productCount": 20,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FNx4IrnHgnU61iN4FksRB2stUa4YkM0UTsdEF8zo.webp",
                                "order": 15,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 831,
                                "name": "Martini Glasses",
                                "slug": "martini-glasses",
                                "parent_id": 240,
                                "productCount": 34,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sLS9q7EnVNtyNLJYA9qNEv0Tn42V8AiSepseHCXT.webp",
                                "order": 16,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 830,
                                "name": "Rocks Glasses",
                                "slug": "rocks-glasses",
                                "parent_id": 240,
                                "productCount": 108,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yyY2wwP0N359Ixno6xorpK9E9XIgMmrkfpP6SMGG.webp",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 839,
                                "name": "Whisky Glasses",
                                "slug": "whisky-glasses",
                                "parent_id": 240,
                                "productCount": 11,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ACGKjCCvwXQovV9jOfWzJODbLwcBTwNU8XIkVoGq.webp",
                                "order": 19,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 238,
                        "name": "Shot Glasses",
                        "slug": "shot-glasses",
                        "parent_id": 74,
                        "productCount": 38,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/shot-glasses-1.png",
                        "order": 4,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 510,
                        "name": "Glass Coffee Mugs \/ Cups",
                        "slug": "glass-coffee-mugs-glass-cups",
                        "parent_id": 74,
                        "productCount": 38,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/double-wall-glasses-1.png",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 229,
                        "name": "Jug Decanter & Carafe",
                        "slug": "jug-decanter-carafe",
                        "parent_id": 74,
                        "productCount": 63,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/jug-decanters-and-carafe-1.png",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 235,
                        "name": "Reusable Plastic Glasses",
                        "slug": "reusable-plastic-glasses",
                        "parent_id": 74,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/unbreakable-glasses-1.png",
                        "order": 17,
                        "children": [
                            {
                                "id": 846,
                                "name": "Reusable Plastic Barware",
                                "slug": "reusable-plastic-barware",
                                "parent_id": 235,
                                "productCount": 72,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/IB9u3bzT4zqUr5Jy5r2nNDihULBccF4WggwuzxHx.webp",
                                "order": 4,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 845,
                                "name": "Plastic Tumbler",
                                "slug": "plastic-tumbler",
                                "parent_id": 235,
                                "productCount": 131,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tRbrXvsQV6dZ7XR7nQYek0Kdfsv3lHGBhhRtAzDA.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 854,
                        "name": "Pitcher",
                        "slug": "pitcher",
                        "parent_id": 74,
                        "productCount": 78,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Ozs7I2EaCrSjXEAc5h5gKalgtiERyk0Gnb0Umi9N.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 851,
                        "name": "Coffee Carafes & Decanters",
                        "slug": "coffee-carafes-coffee-decanters",
                        "parent_id": 74,
                        "productCount": 80,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/M8PvN6VWyTRJXxdXfBtlpEkjzu9SwLL7bdDKgQuF.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 75,
                "name": "Bar Equipment",
                "slug": "bar-equipment",
                "parent_id": 67,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/bar-tools-and-equipment-2.webp",
                "order": 6,
                "children": [
                    {
                        "id": 874,
                        "name": "Ice Supplies",
                        "slug": "ice-supplies",
                        "parent_id": 75,
                        "productCount": 20,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/omxebPRq55OdtB9CNxu7mlhBmBYfIFzuDlrMxoyr.png",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 870,
                        "name": "Jiggers",
                        "slug": "jiggers",
                        "parent_id": 75,
                        "productCount": 27,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/6qGO5udASZE5tXCI2iP1TuwB1mNJZTL5tmCWzHSw.webp",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 251,
                        "name": "Bartending Supplies",
                        "slug": "bartending-supplies",
                        "parent_id": 75,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rRyfnWC0tRPk2guyq9xfXkuUkqNtK1eTh9S1mMMk.webp",
                        "order": 17,
                        "children": [
                            {
                                "id": 872,
                                "name": "Corkscrews and Bottle Openers",
                                "slug": "corkscrews-bottle-openers",
                                "parent_id": 251,
                                "productCount": 37,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/W0bgdoNAVy3LMEL3Ihwg2ogUEjQduUz1Ci9VnnAl.webp",
                                "order": 5,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 871,
                                "name": "Wine Accessories",
                                "slug": "wine-accessories",
                                "parent_id": 251,
                                "productCount": 24,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rT2XKiJMlq7KB9XHAa4j5up9NuZQ7PGuQZdYXf2E.webp",
                                "order": 7,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 920,
                                "name": "Speed Rails",
                                "slug": "speed-rails",
                                "parent_id": 251,
                                "productCount": 17,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UrxaCTPjm3LE2x8FFkaVY7XCeGgrTI7CcTbKDo6r.webp",
                                "order": 8,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 929,
                                "name": "Bar Utensils",
                                "slug": "bar-utensils",
                                "parent_id": 251,
                                "productCount": 8,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FiL3tI3RHY3HMWKl9d4rEA4lduLjYJqxKCEVK8Na.webp",
                                "order": 9,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 1025,
                                "name": "Beverage Tubs & Bins",
                                "slug": "beverage-tubs-bins",
                                "parent_id": 251,
                                "productCount": 1,
                                "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/jdtglEazO27zXyAfzZyRr8HEuoK8mOfrZJdZARIF.png",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 250,
                        "name": "Cocktail Shaker",
                        "slug": "cocktail-shaker",
                        "parent_id": 75,
                        "productCount": 35,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FTV0sGIrydaNwazHgC67ioicAOadIN3zJUMGbdjv.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 255,
                        "name": "Ice Bucket",
                        "slug": "ice-bucket",
                        "parent_id": 75,
                        "productCount": 6,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/ice-bucket-1.webp",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 247,
                        "name": "Bar Mats & Shelf Liners",
                        "slug": "bar-mats-shelf-liners",
                        "parent_id": 75,
                        "productCount": 53,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yRQ53alaHxvdxyIKMXDfSpfUKIIWaZjBTWh6ig5Y.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 918,
                        "name": "Hanging Bar Glass Rack",
                        "slug": "hanging-bar-glass-rack",
                        "parent_id": 75,
                        "productCount": 14,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TyH1y5Pj3EBo3NHHYAc3ZBeQXnhZVkLh0EyvgNoB.webp",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 873,
                        "name": "Liquor Pourers",
                        "slug": "liquor-pourers",
                        "parent_id": 75,
                        "productCount": 138,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/oEzuW4SBLb8sV2Xl82u1xuuDh2WiY53rq73CmPRX.webp",
                        "order": 28,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 941,
                "name": "Cutlery",
                "slug": "cutlery",
                "parent_id": 67,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/icons\/F7xMSDVeKT3deBYwZgjrKE0KvUPhZ8XPDtovn0Mm.webp",
                "order": 7,
                "children": [
                    {
                        "id": 815,
                        "name": "Forks",
                        "slug": "forks",
                        "parent_id": 941,
                        "productCount": 234,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TrPUQ44Gvnd5wxRy9AALTq4I7pWVblmMlirSDkfZ.webp",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 814,
                        "name": "Spoons",
                        "slug": "spoons",
                        "parent_id": 941,
                        "productCount": 362,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/bBOg0U5NWGvQdezbQlt6dN9qu169AAkN8HnInZYd.webp",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 816,
                        "name": "Knives",
                        "slug": "knives",
                        "parent_id": 941,
                        "productCount": 114,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/EiYJdSbSMcv3uARaiZXK3AO3RL3tMtLXoeKmYoK3.webp",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 960,
        "name": "Disposables",
        "slug": "disposables",
        "parent_id": 0,
        "productCount": 1,
        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/QRjHVbvjn1UQ6zsyAk37zIk5bvR7TnrowILvSPB3.webp",
        "order": 4,
        "children": [
            {
                "id": 961,
                "name": "Janitorial Disposables",
                "slug": "janitorial-disposables",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/3vnVmaqzL1i3Jw04eprNt1bUn0XiELu4VM4fHImS.webp",
                "order": 42,
                "children": [
                    {
                        "id": 962,
                        "name": "Trash Bags & Trash Can Liners",
                        "slug": "trash-bags-trash-can-liners",
                        "parent_id": 961,
                        "productCount": 71,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/vvqEdKsgvCrOgfOJsD90ihP0ZIR4Cbe1sqC0L0E3.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 963,
                        "name": "Paper Towels",
                        "slug": "paper-towels",
                        "parent_id": 961,
                        "productCount": 42,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/faGUsXpQvY6P0UNQqiY7ujgUVmAfuhzkwvW8fNPW.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 964,
                        "name": "Toilet Paper & Toilet Tissue",
                        "slug": "toilet-paper-toilet-tissue",
                        "parent_id": 961,
                        "productCount": 29,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yRbGbU4kE9SFXwkfL1nCHZYkM27bSwFKQSZPMJhV.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 965,
                        "name": "Facial Tissue",
                        "slug": "facial-tissue",
                        "parent_id": 961,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rlza4QGimqO8R65LIuc7GEu7hChohp3HoCiQnLBg.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1001,
                        "name": "Industrial Wipers",
                        "slug": "industrial-wipers",
                        "parent_id": 961,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/8X9KCAeiAzEmtrkeu1YcY64fjZXIuzCiNVvQVYo6.png",
                        "order": 42,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1018,
                        "name": "Disposable Gloves",
                        "slug": "disposable-gloves",
                        "parent_id": 961,
                        "productCount": 47,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/8qLshErSLI5gZ0rOuS93GYxvmBtrB1DzaePcROAJ.webp",
                        "order": 50,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1019,
                        "name": "Disposable Apparel",
                        "slug": "disposable-apparel",
                        "parent_id": 961,
                        "productCount": 17,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/oJW21vc3gSkK3HYAx2UktiGVTPrSrwO76X1tycob.webp",
                        "order": 51,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1020,
                        "name": "Disposable Face Masks",
                        "slug": "disposable-face-mask",
                        "parent_id": 961,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pCCiO3FQ3cHNaAxKtrVqB9WlHCBjp4UN9H6FoVJw.webp",
                        "order": 52,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1021,
                        "name": "Toilet Seat Covers & Dispensers",
                        "slug": "toilet-seat-covers-dispensers",
                        "parent_id": 961,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/5Gc3mamDSd2Ofq4fQdzzw55pmivwHmnArDNMjXHg.webp",
                        "order": 53,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1023,
                        "name": "Labeling & POS Supplies",
                        "slug": "labeling-pos-supplies",
                        "parent_id": 961,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/MLpqsOXAIvCZdvKvB7qSa42G2LwA7sUlxucxJm1v.webp",
                        "order": 54,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1026,
                        "name": "Cleaning Chemicals",
                        "slug": "cleaning-chemicals",
                        "parent_id": 961,
                        "productCount": 27,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sZGoeO13H2wss8onepuR86hxgGVVS1CRc8N9m18D.png",
                        "order": 55,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1027,
                        "name": "Cleaning Tools & Supplies",
                        "slug": "cleaning-supplies-tools",
                        "parent_id": 961,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WQeaCS6coXf6HA5ZYeGvidpUiUufS76iWPlWWo1o.webp",
                        "order": 56,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1029,
                        "name": "Jugs, Buckets, and Pails",
                        "slug": "jug-bucket-pail",
                        "parent_id": 961,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ZpL9WfCVLU7n9iBwuZ29uBhKlDIgqC9ATRPSZAXn.webp",
                        "order": 57,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1030,
                        "name": "Laundry Supplies",
                        "slug": "laundry-supplies",
                        "parent_id": 961,
                        "productCount": 13,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/53J6LNVVRYVZ85ngnuaqQAHQ1owiZTdBrhuARyGL.webp",
                        "order": 58,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1032,
                        "name": "Pre-Moistened Sanitizing \/ Disinfectant Surface Wipes",
                        "slug": "pre-moistened-sanitizing-surface-disinfectant-wipes",
                        "parent_id": 961,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rAQMdeOcJb197bxiCUO8qrlb0KP8w4GchNtgNVxV.webp",
                        "order": 59,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1034,
                        "name": "Sponges and Scrubbers",
                        "slug": "scrubbers-sponges",
                        "parent_id": 961,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/4oSX4DQgATFTnQvKeQx26jJcytqAhYxCuACV6nk4.webp",
                        "order": 60,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1033,
                        "name": "Restroom Supplies",
                        "slug": "restroom-supplies",
                        "parent_id": 961,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ozdqQNH8xvtBh6kbNoJqWp4IouxCPq3Ecc9JmPgo.png",
                        "order": 61,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 969,
                "name": "Foam Products",
                "slug": "foam-products",
                "parent_id": 960,
                "productCount": 1,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/J4DA9mkpnvmKb9y4U9HUzBAN1UV6Z9pJj5AO1Oq3.webp",
                "order": 44,
                "children": [
                    {
                        "id": 970,
                        "name": "Foam Cups and Lids",
                        "slug": "foam-cups-lids",
                        "parent_id": 969,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/hgIN6Gg3seWFJrMPamcsVMViNKjlf4mYuF1glN4r.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 971,
                        "name": "Foam Takeout Container",
                        "slug": "foam-takeout-container",
                        "parent_id": 969,
                        "productCount": 16,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/9s7NsGCqnNRx9IFIeRqeEMRwZdLv4gJudWQ0eN9Y.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1024,
                        "name": "Foam Plates",
                        "slug": "foam-plates",
                        "parent_id": 969,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/KrldOB5LVrnVJJ0mKDxmSrcYO5Ox9P7hVAw94XM8.png",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 972,
                "name": "Food Storage Supplies",
                "slug": "food-storage-supplies",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/uRjvP9sHX9FSU1rBt0eeMtMZDNT6vIZovS9R28Aj.webp",
                "order": 45,
                "children": [
                    {
                        "id": 973,
                        "name": "Food Storage Containers",
                        "slug": "food-storage-containers",
                        "parent_id": 972,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Yuuu8mL3IM0UpkKnKE9E0X9I8rm9MletPpytGPZZ.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 974,
                "name": "Disposable Food Packaging Supplies",
                "slug": "disposable-food-packaging-supplies",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/iI7Ygvz9CDFNgshOknoTSXMzzWLFMY0BQo0QnVjo.webp",
                "order": 46,
                "children": [
                    {
                        "id": 975,
                        "name": "Disposable Bags",
                        "slug": "disposable-bags",
                        "parent_id": 974,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/SWyRf69dMCDZ9yWD3LkS1ZdeJZCrVo5jTssH4QUM.webp",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1013,
                        "name": "Food Packaging Wrap",
                        "slug": "food-packaging-wrap",
                        "parent_id": 974,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sCgbpxX2Ulf7aTFuXwfqryX6xXKwc5F2hgIhrUKK.png",
                        "order": 4,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1022,
                        "name": "Twist Ties",
                        "slug": "twist-ties",
                        "parent_id": 974,
                        "productCount": 1,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/F0c78UlHnV7cbUURlGYBsssC78ToFmpQy6NLGZLb.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 976,
                "name": "Disposable Tableware",
                "slug": "disposable-tableware",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/CWRiX8DLT2cK05MosG9vwMqe1E6OM0lSpjGfoKLK.webp",
                "order": 47,
                "children": [
                    {
                        "id": 977,
                        "name": "Disposable Cutlery",
                        "slug": "disposable-cutlery",
                        "parent_id": 976,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/QT8M0xQ3FnIPlnEqQ2lKlMwYrQQcnngtvGluKfQe.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 978,
                        "name": "Disposable Food Tray",
                        "slug": "disposable-food-tray",
                        "parent_id": 976,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/SHQ0EIipHX4tnqeq8ky4Txt2NXvl9HEesHclXTYL.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 979,
                "name": "Disposable Food Containers",
                "slug": "disposable-food-containers",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WzFkYYZwPfIXZDz3GwAELf3JHpIYvtJRFoAS4Uol.webp",
                "order": 48,
                "children": [
                    {
                        "id": 980,
                        "name": "Condiment Cups & Lids",
                        "slug": "condiment-cups-lids",
                        "parent_id": 979,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TJzK3ujRMgZXVf2pbY84ih74sIl5NbPjlMuxVbFn.webp",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 981,
                "name": "Disposable Cups",
                "slug": "disposable-cups",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/5Eq7oQXXAOSni93xDzLiBF3fl2A5XiK32qxw9m32.webp",
                "order": 49,
                "children": [
                    {
                        "id": 982,
                        "name": "Plastic Cups",
                        "slug": "plastic-cups",
                        "parent_id": 981,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/NWN9FyDI5mX94KLyuhcbww7jmim8uTmNmr7cN02s.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 983,
                        "name": "Plastic Cup Lids",
                        "slug": "plastic-cup-ids",
                        "parent_id": 981,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TtdrED3KUGqgKrFUv9b0OzMcjunaSACCQriTh512.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 984,
                "name": "Aluminum Foil and Containers",
                "slug": "aluminum-foil-containers",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/COtemktsrm8urK70nColJ7mh1D8iYS8Irn3hyvDJ.webp",
                "order": 50,
                "children": [
                    {
                        "id": 985,
                        "name": "Aluminum Foil Steam Table Pans & Lids",
                        "slug": "aluminum-foil-steam-table-pans-lids",
                        "parent_id": 984,
                        "productCount": 4,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sYFaG6ZI21gIOiBuYl8d6o3nLYNsHEQroGw4Lcku.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 991,
                        "name": "Aluminum Foil Rolls",
                        "slug": "aluminum-foil-roll",
                        "parent_id": 984,
                        "productCount": 5,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/4orLD44sQd6PGuOXDyFKziKMxJGWMqtLqITrmMQL.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 986,
                "name": "Plastic Bags & Wraps",
                "slug": "plastic-bags-wraps",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sS6h4uFtmBLQ47hIXF7WtAYsoReBjz4AMF1eSmbt.webp",
                "order": 51,
                "children": [
                    {
                        "id": 987,
                        "name": "To-go Bags",
                        "slug": "to-go-bags",
                        "parent_id": 986,
                        "productCount": 2,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/URpcRAHr4x4RDjfFOCYKVT22W4n43ryeYouuVmWx.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 988,
                        "name": "Plastic Wrap",
                        "slug": "plastic-wrap",
                        "parent_id": 986,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/d4MRXujZFDQxo21ljfUzHl0L5HmeY1HNjWD1iKbo.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 966,
                "name": "Tabletop Disposables",
                "slug": "tabletop-disposables",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/zNJ3A170lTrn8cS9wi6mvnVaLKiAa9y5EWx98VcG.webp",
                "order": 52,
                "children": [
                    {
                        "id": 967,
                        "name": "Paper Napkins",
                        "slug": "paper-napkins",
                        "parent_id": 966,
                        "productCount": 14,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/JS0VetPCzo8ThYPpFDrUi1IJPplMTr1IKed7h8gH.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 968,
                        "name": "Dispenser Napkins",
                        "slug": "dispenser-napkins",
                        "parent_id": 966,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/pL4jTAYM7euJw1G54p7lZBkL4vWnzR6zXNqr8YCb.webp",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1014,
                        "name": "Straw",
                        "slug": "straw",
                        "parent_id": 966,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2NTOaAdtwJN0MyiFXVasBQeLcELGiu8mQMwXTn3p.png",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1017,
                        "name": "Disposable Tablecloths",
                        "slug": "disposable-tablecloths",
                        "parent_id": 966,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ve9KGo5uKPGOI9jSY2UuoyjVBWQO7FOhDzCvMglK.png",
                        "order": 14,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1015,
                "name": "Take-Out Containers and To-Go Boxes",
                "slug": "take-out-containers-to-go-boxes",
                "parent_id": 960,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yGjB6hcFqeB3UbIy480ZGMC1IOY5YuLAgdKA0i6A.png",
                "order": 53,
                "children": [
                    {
                        "id": 1016,
                        "name": "Take-Out Cup Carriers",
                        "slug": "take-out-cup-carriers",
                        "parent_id": 1015,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/XjxUyEwwZGY4KoqsiflIihQGiSZeudTNISfnmtQ3.png",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 1038,
        "name": "Food Trailers and Trucks",
        "slug": "food-trailers-and-trucks",
        "parent_id": 0,
        "productCount": 0,
        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/pMcVVF0zEiyByL3Cue1cOhviciFfPTOSOwofU8bJ.webp",
        "order": 5,
        "children": [
            {
                "id": 1040,
                "name": "Food Truck",
                "slug": "food-truck",
                "parent_id": 1038,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/9fXESj6R7pMXMjj8aOPFVfqyPCd2RbCoLt6NplnE.png",
                "order": 17,
                "children": [
                    {
                        "id": 1059,
                        "name": "Burger Food Truck",
                        "slug": "burger-food-truck",
                        "parent_id": 1040,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ueI7tf3lk7RcEr5KQqpoVIkPiXcCntkXXbx00NaE.png",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1060,
                        "name": "Fried Chicken Food Truck",
                        "slug": "fried-chicken-food-truck",
                        "parent_id": 1040,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/AQ3a94i9fqtMu6i7BiB0J5OCfRo5ZH1SfXaOEu5M.png",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1061,
                        "name": "Breakfast Food Truck",
                        "slug": "breakfast-food-truck",
                        "parent_id": 1040,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/CHsPLSNjgezjDUPOgxK346UOIjg9XcqRBVwpOxzh.png",
                        "order": 14,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1065,
                        "name": "Healthy Food Trucks",
                        "slug": "healthy-food-trucks",
                        "parent_id": 1040,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/JNPV8viALYTN3SPStelGccZwEdkIQoFEwkTqZvCo.png",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1041,
                "name": "Beverage Trailer",
                "slug": "beverage-trailer",
                "parent_id": 1038,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/dzfpO5XwF7sOCfMFoYg8mnPNPEpIpMG5wtyTVsmy.png",
                "order": 18,
                "children": [
                    {
                        "id": 1056,
                        "name": "Bubble Tea Food Truck",
                        "slug": "bubble-tea-food-truck",
                        "parent_id": 1041,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7Tw5SPSKkiIQ4jMxGtTiK01KIjDv1IcxiVSQ9B2G.png",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1057,
                        "name": "Coffee Truck",
                        "slug": "coffee-truck",
                        "parent_id": 1041,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Upm6SpkZGx34EQoHFreXpb4X9txLjVl4yTanK9ck.png",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1058,
                        "name": "Smoothie Truck",
                        "slug": "smoothie-truck",
                        "parent_id": 1041,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7TLWuChsoY3xrxWxXUGKGyZ1Sz2RnEjQuFp7kX4j.png",
                        "order": 12,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1042,
                "name": "Dessert Food Trucks",
                "slug": "dessert-food-trucks",
                "parent_id": 1038,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/g3Fz5AbJmNKARQxEOW5O3J7gyxQh1NDQPn9XsctW.png",
                "order": 19,
                "children": [
                    {
                        "id": 1062,
                        "name": "Ice Cream Truck",
                        "slug": "ice-cream-truck",
                        "parent_id": 1042,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/H1wzn8ZTwm7CIlqYk0DGchIii19W0EvNDZtkjcEU.png",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1043,
                "name": "BBQ Trailer",
                "slug": "bbq-trailer",
                "parent_id": 1038,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/uU7jMpC8YgMpQqPH4SsxWugVuyWMewkkmPea4ITb.png",
                "order": 20,
                "children": [
                    {
                        "id": 1063,
                        "name": "BBQ Food Truck",
                        "slug": "bbq-food-truck",
                        "parent_id": 1043,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/09qxEzaZrGN18qmzxxwN93YfOyh6QuWBBjrH6QMd.png",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1044,
                "name": "Pizza Trailer",
                "slug": "pizza-trailer",
                "parent_id": 1038,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/69B1wFpS5zcs2kLJA2RMWMO1ZECqIuXb5wRGijsj.png",
                "order": 21,
                "children": [
                    {
                        "id": 1064,
                        "name": "Pizza Food Truck",
                        "slug": "pizza-food-truck",
                        "parent_id": 1044,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/aw08BjXX1F3vJiXGRp2xm06J4vTgq9HGOlGKZmxC.png",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1045,
                "name": "Custom Food Trailers",
                "slug": "custom-food-trailers",
                "parent_id": 1038,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/VdnDm4pY7b9BBzBqpyFtzVHJfhZCM72OmVW1y2hY.png",
                "order": 22,
                "children": [
                    {
                        "id": 1066,
                        "name": "Build a Food Truck",
                        "slug": "build-a-food-truck",
                        "parent_id": 1045,
                        "productCount": 1,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sX8cN4tPjBTi5gQUWYhiqswE3ZkbWUAZkc5hKdKx.png",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 96,
        "name": "Hotel Supplies",
        "slug": "hotel-supplies",
        "parent_id": 0,
        "productCount": 0,
        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sWMyJhJXrSdQqHjyJOb7xbIZyPTPHB8yOq3KhyOj.webp",
        "order": 6,
        "children": [
            {
                "id": 97,
                "name": "Guest Room Supplies",
                "slug": "guest-room-supplies",
                "parent_id": 96,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/IohBwN4V3smmwMQF5R3ABmluH1Fl209XOQNYhtCu.webp",
                "order": 6,
                "children": [
                    {
                        "id": 269,
                        "name": "Hair Dryer",
                        "slug": "hair-dryer",
                        "parent_id": 97,
                        "productCount": 7,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/XtuVGkOE5SFdc43tjBYOUKWwH59D4JLtNU9veXKh.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 266,
                        "name": "In Room Coffee Maker",
                        "slug": "in-room-coffee-maker",
                        "parent_id": 97,
                        "productCount": 7,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/LgUZYPnjh7558qAJfgQhIzuXFzhZIOXpdF0MclY9.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 634,
                        "name": "Ironing Boards",
                        "slug": "ironing-boards",
                        "parent_id": 97,
                        "productCount": 40,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/vXTUixbATjmQj2qZsKy5aFfRSQNIu3sScWYB9QQt.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 633,
                        "name": "Irons",
                        "slug": "irons",
                        "parent_id": 97,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/v2L2hiydxXwTUb28L2Hc9k29gtiOoFa48vqnJJ09.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 258,
                        "name": "Luggage Rack",
                        "slug": "luggage-rack",
                        "parent_id": 97,
                        "productCount": 62,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WaPlLeYY6CaAoHoOsSdCVRksdU3JkaugVNfcV8yp.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 272,
                        "name": "Hotel Room Microwave",
                        "slug": "hotel-room-microwave",
                        "parent_id": 97,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/1eIbY3csoRrvuJCATsHF8dxZ9NQrvoo7dvM4bfy2.webp",
                        "order": 28,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 325,
                        "name": "Platform Bed",
                        "slug": "platform-bed",
                        "parent_id": 97,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/N0F0MUvNpzHig2RWN2HyixVg0BbOjjYVaBz6WweC.webp",
                        "order": 29,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 884,
                        "name": "Television",
                        "slug": "television",
                        "parent_id": 97,
                        "productCount": 67,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2XU94qqXY7nGYBLRQMxdzSL03ocob9za4eILYkBe.webp",
                        "order": 33,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 275,
                        "name": "Hotel Refrigerator",
                        "slug": "hotel-refrigerator",
                        "parent_id": 97,
                        "productCount": 13,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Rj5PtwCnn92eK30r9kMSWVqCupzG03leN0AjgdrN.webp",
                        "order": 34,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 103,
                        "name": "Hotel Furniture",
                        "slug": "hotel-furniture",
                        "parent_id": 97,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/F10KNuHiX4BLYeo6wXaLJmpj1CuTausGOpe2YNXb.webp",
                        "order": 35,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 99,
                "name": "Heating And Cooling Systems",
                "slug": "heating-cooling-systems",
                "parent_id": 96,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sIWf1UAyn72hUkpTRgY3UVxCWXCufM8pJj8sH172.webp",
                "order": 7,
                "children": [
                    {
                        "id": 655,
                        "name": "Wall Air Conditioners",
                        "slug": "wall-air-conditioners",
                        "parent_id": 99,
                        "productCount": 64,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/seP4B4fIo92MRS3bmIwinXNlyXafVCwT2vKLvdZF.webp",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 652,
                        "name": "Hotel PTAC Units",
                        "slug": "hotel-ptac-units",
                        "parent_id": 99,
                        "productCount": 73,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/gv8Yp5UTf3a0usjVqQVAIFClhnvHHqOkoZ0eYJqP.webp",
                        "order": 8,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 291,
                        "name": "Commercial Thermostat",
                        "slug": "commercial-thermostat",
                        "parent_id": 99,
                        "productCount": 15,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FxNYACQsBGFRuWyFlCdn76hPMREflTV6Un9NjUa9.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 289,
                        "name": "Air Conditioners Accessories",
                        "slug": "air-conditioners-accessories",
                        "parent_id": 99,
                        "productCount": 33,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Zl6Ukfr5qi6uxoBB4gWip1oXGFbB3xk20SPDG3kc.webp",
                        "order": 10,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 1078,
                "name": "Lockers",
                "slug": null,
                "parent_id": 96,
                "productCount": 1,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/bGlHdEsmgDxUitSbVHIh10dI6IBsFMFR0MY9Qa28.png",
                "order": 8,
                "children": [],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 76,
        "name": "Smallware",
        "slug": "smallware",
        "parent_id": 0,
        "productCount": 11,
        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ubytaQzV7Jszx8awjO6eFlEVn3iCLW062pQhgbuX.webp",
        "order": 7,
        "children": [
            {
                "id": 77,
                "name": "Cookware",
                "slug": "cookware",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cookware-3.webp",
                "order": 0,
                "children": [
                    {
                        "id": 891,
                        "name": "Sauce Pan",
                        "slug": "sauce-pan",
                        "parent_id": 77,
                        "productCount": 140,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yT57ucOP3zDA88sBFBgh2xZmHE48HGwGwb7WH1Lo.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 904,
                        "name": "Sauce Pot",
                        "slug": "sauce-pot",
                        "parent_id": 77,
                        "productCount": 42,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/VriuQ4sw18mGEr9DmtnToUQOrcfRoiievp7hSWFr.webp",
                        "order": 13,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 371,
                        "name": "Woks",
                        "slug": "woks",
                        "parent_id": 77,
                        "productCount": 60,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/P1LuS8UpjoMormOibCeq2TRfz7xgjY37LEQuMnN4.webp",
                        "order": 32,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 370,
                        "name": "Pasta Pot And Strainer Basket",
                        "slug": "pasta-pot-strainer-basket",
                        "parent_id": 77,
                        "productCount": 28,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/i4oco5MxJGuAF8wS4Z6ui0mCj8LN4u5BWQEuWxDm.webp",
                        "order": 34,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 372,
                        "name": "Stock Pot",
                        "slug": "stock-pot",
                        "parent_id": 77,
                        "productCount": 182,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/PeIohDr0vbl1uHaJJIa0GLsBvMHpBE4RhfuqqLDr.webp",
                        "order": 35,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 373,
                        "name": "Frying Pan",
                        "slug": "frying-pan",
                        "parent_id": 77,
                        "productCount": 236,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/lZ9M5IqR4nFCXrBNwfW7R6CScvLggfPfq8Eghojr.webp",
                        "order": 36,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 374,
                        "name": "Cast Iron Cookware",
                        "slug": "cast-iron-cookware",
                        "parent_id": 77,
                        "productCount": 242,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rGoL1yUa05qlJdnBaCv4AskrWQHPeYdCgjASlKsC.webp",
                        "order": 37,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 368,
                        "name": "Brazier \/ Braising Pot",
                        "slug": "brazier-braising-pot",
                        "parent_id": 77,
                        "productCount": 54,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/0QpirIwAJuyhw0FommQgNpziPNnJiWUXWqWEeCEd.webp",
                        "order": 40,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 367,
                        "name": "Double Boiler",
                        "slug": "double-boiler",
                        "parent_id": 77,
                        "productCount": 11,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/double-boilers.webp",
                        "order": 41,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 78,
                "name": "Storage And Transportation",
                "slug": "storage-transportation",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/storage-and-transportation-2.webp",
                "order": 1,
                "children": [
                    {
                        "id": 363,
                        "name": "Food Storage Boxes",
                        "slug": "food-storage-boxes",
                        "parent_id": 78,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/w2SeJS8HnXmKTYCMMw7DFlQpVO3MkDxXQcSJE7I2.webp",
                        "order": 3,
                        "children": [
                            {
                                "id": 690,
                                "name": "Food Pan Carrier",
                                "slug": "insulated-food-pan-carriers",
                                "parent_id": 363,
                                "productCount": 8,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/S8WnkHc0bdEuQLHtUejQUzRPHI6ASGT2gsF0VKVc.webp",
                                "order": 0,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 680,
                                "name": "Plastic Storage Boxes",
                                "slug": "plastic-storage-boxes",
                                "parent_id": 363,
                                "productCount": 264,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/5DfZj0fmzNlgeECYXw2TVKw8BhKPPcjUfQIz6unn.webp",
                                "order": 1,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 681,
                                "name": "Bus Tubs & Bus Pans",
                                "slug": "bus-tubs-bus-pans",
                                "parent_id": 363,
                                "productCount": 49,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/mMcihZv5WDbHVWJxZOPgAvcFGzhaKcsK33IV8QuI.webp",
                                "order": 2,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 364,
                        "name": "Commercial Carts",
                        "slug": "commercial-carts",
                        "parent_id": 78,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/serving-trolleys-utility-1.png",
                        "order": 4,
                        "children": [
                            {
                                "id": 674,
                                "name": "Plastic Utility Cart",
                                "slug": "plastic-utility-cart",
                                "parent_id": 364,
                                "productCount": 12,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/QdlUHSWEu9fzaFZ6ZFR12wJvnNIpSPyV5SRmbYnE.webp",
                                "order": 17,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 678,
                                "name": "Serving Cart",
                                "slug": "serving-cart",
                                "parent_id": 364,
                                "productCount": 33,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/hxdFbwdZ8ei5g6zotdakB4dVA3h0qKBQhJAKR7DC.webp",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 679,
                                "name": "Cart Accessories",
                                "slug": "cart-accessories",
                                "parent_id": 364,
                                "productCount": 101,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/nUlA7o7CETZULdc2Bh6FShtr301AHqOxOvs6M8Ei.webp",
                                "order": 19,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 361,
                        "name": "Ingredient Bin",
                        "slug": "ingredient-bins-and-scoop",
                        "parent_id": 78,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/freepik-br-d7316b8e-59e3-48b7-aa1b-3056a5162a5a.png",
                        "order": 5,
                        "children": [
                            {
                                "id": 731,
                                "name": "Ingredient Bins Scoop",
                                "slug": "ingredient-bins-scoop",
                                "parent_id": 361,
                                "productCount": 6,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/cuXPlhZbSJaVNiIPsykXLcpXprgW7sC9odNelUao.webp",
                                "order": 2,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 729,
                                "name": "Mobile Ingredient Bin",
                                "slug": "mobile-ingredient-bin",
                                "parent_id": 361,
                                "productCount": 9,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/u8rBgLFC996DQXcohkOnE2q31jfTYYmaPnJ6SoTn.webp",
                                "order": 9,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 730,
                                "name": "Shelf Ingredient Bins",
                                "slug": "shelf-ingredient-bins",
                                "parent_id": 361,
                                "productCount": 9,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DUoTadKpASsxn7RLmRBSIQzfDPY3JKIkJWorNw8p.webp",
                                "order": 10,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 686,
                        "name": "Dunnage Rack",
                        "slug": "dunnage-rack",
                        "parent_id": 78,
                        "productCount": 22,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tJGcbAz2xb0qsdWPrT4QIDdkZ0iL4ZDsFe5ODIm8.webp",
                        "order": 6,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 1084,
                        "name": "Commercial Glass Rack",
                        "slug": "commercial-glass-rack",
                        "parent_id": 78,
                        "productCount": 2,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/6L3I3Bd8mqQHrLbJpt7Jf8T3jcw4XsFNOgktgoHq.png",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 79,
                "name": "Pizza Tools and Bakeware",
                "slug": "pizza-equipment-and-supplies",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/pizza-equipment-and-supplies-1.png",
                "order": 2,
                "children": [
                    {
                        "id": 699,
                        "name": "Aluminium Tray",
                        "slug": "aluminium-serveware",
                        "parent_id": 79,
                        "productCount": 56,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DRWZa40dRby3MkgIsJwCpuobKmppk2ZoUXiNmP9G.webp",
                        "order": 4,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 706,
                        "name": "Deep Dish Pan",
                        "slug": "deep-dish-pan",
                        "parent_id": 79,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/olRH30AijdcuyjwiNlmax1Sss11UNxgrNDPaHMdn.webp",
                        "order": 7,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 709,
                        "name": "Pizza Screen & Disks",
                        "slug": "pizza-screen-disks",
                        "parent_id": 79,
                        "productCount": 42,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2WFML8HJ4uaLjxHc5KribHxjFRtxPjippHOlOjiX.webp",
                        "order": 8,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 711,
                        "name": "Pizza Cutters",
                        "slug": "pizza-cutters",
                        "parent_id": 79,
                        "productCount": 57,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DOCbNryrcMXeVr2LULVThoDOcuNpHTSw9HiFb6sV.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 713,
                        "name": "Pizza Dough Docker",
                        "slug": "pizza-dough-docker",
                        "parent_id": 79,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/e6tdlyxFluFzNaZl11emwd2VkbGkYAAuJXE5yJyW.webp",
                        "order": 11,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 716,
                        "name": "Pizza Stand",
                        "slug": "pizza-stands",
                        "parent_id": 79,
                        "productCount": 4,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/9KDhZBjrJyNUkMpjQtZej6njOntxQRxH60t755CJ.webp",
                        "order": 14,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 708,
                        "name": "Wide Rim Pans",
                        "slug": "wide-rim-pans",
                        "parent_id": 79,
                        "productCount": 14,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7Sb93LK6Jn2RxbTv0vSf5mTRbsRY66Uwpf1H6WBB.webp",
                        "order": 21,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 703,
                        "name": "Aluminium Blade",
                        "slug": "aluminium-blade",
                        "parent_id": 79,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/SFs6ilV5jjyChYg7OTUJHqtSyPBcXZV6GPCffTsT.webp",
                        "order": 24,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 702,
                        "name": "Wooden Blade",
                        "slug": "wooden-blade",
                        "parent_id": 79,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/SQo0liuLeskKsnLH8az4hYaw5qeZHgV3bAlcrcYl.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 80,
                "name": "Food Pans and Accessories",
                "slug": "food-pans-food-accessories",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/food-storage-containers-1.png",
                "order": 3,
                "children": [
                    {
                        "id": 351,
                        "name": "Steam Table Pans, Hotel Pans & Buffet Pans",
                        "slug": "steam-table-pans-hotel-pans-buffet-pans",
                        "parent_id": 80,
                        "productCount": 345,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/9lfTq9hNsLCS25jC13oAwOiMtpR0W3usG7SFMy2r.webp",
                        "order": 2,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 722,
                        "name": "Steam Table Pan Covers",
                        "slug": "steam-table-pan-covers",
                        "parent_id": 80,
                        "productCount": 36,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tJO0CYq8xDz26XaSi28oTblOYTEYvCodEDkY5E2e.webp",
                        "order": 3,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 723,
                        "name": "Steam Table Accessories",
                        "slug": "steam-table-accessories",
                        "parent_id": 80,
                        "productCount": 24,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/xLftWYLTpshXQq18gQSmmJx4Lbtezm1xaQ2sbaxP.webp",
                        "order": 4,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 724,
                        "name": "Polycarbonate Food Pan Lid",
                        "slug": "polycarbonate-food-pan-lid",
                        "parent_id": 80,
                        "productCount": 52,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/n7iEJg1hSBi2tDGu1FO4GwOQs71Z5nDiyjpCobPW.webp",
                        "order": 5,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 728,
                        "name": "Food Pan Drain Trays",
                        "slug": "food-pan-drain-trays",
                        "parent_id": 80,
                        "productCount": 40,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/yezNvoQqBN1R6WlyNi1hbyca3hUhjO3gvjlj2gPD.webp",
                        "order": 9,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 350,
                        "name": "Plastic Food Pans",
                        "slug": "plastic-food-pans",
                        "parent_id": 80,
                        "productCount": 91,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/tOjceuLIWoe5qV4rwVu9QLkGwYGEQUYIC62ynRsa.webp",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 906,
                        "name": "Bain Marie Pot and Vegetable Inset",
                        "slug": "bain-marie-pot-vegetable-inset",
                        "parent_id": 80,
                        "productCount": 59,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/6qtLfwlU9mmgnfbu8ZQ80kcarNVoF2T8VRaIUUlK.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 81,
                "name": "Kitchen Knives",
                "slug": "kitchen-knives",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/WTEYLm3CRPb1xvHFEkdQHVN2H1V2yR4AdJeIBrsL.webp",
                "order": 4,
                "children": [
                    {
                        "id": 347,
                        "name": "Boning Knives",
                        "slug": "boning-knives",
                        "parent_id": 81,
                        "productCount": 212,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/qqVrBIA1EtpbyZsKqpUonpNR1ldctovlqUqPXqiQ.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 333,
                        "name": "Chef Knives",
                        "slug": "chef-knives",
                        "parent_id": 81,
                        "productCount": 293,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/0CYjnryjJKcryvyxk582wNtiiAdMh7TWl5O2WSOC.webp",
                        "order": 21,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 343,
                        "name": "Cleaver",
                        "slug": "cleaver",
                        "parent_id": 81,
                        "productCount": 56,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/JII6jqqcW4lQRtHoZXgtVlTG8AKVbbsvDjO0eNU9.webp",
                        "order": 22,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 345,
                        "name": "Japanese Knives",
                        "slug": "japanese-knives",
                        "parent_id": 81,
                        "productCount": 133,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Abd2nzCaFT992w2fUKECTOQoNaKr1tSyRnxXsMTf.webp",
                        "order": 23,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 344,
                        "name": "Meat Slicing and Carving Knives",
                        "slug": "meat-slicing-knives-carving-knives",
                        "parent_id": 81,
                        "productCount": 135,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/wgKTGm1Oddcjq1xGxG5K5AzzvVXuMGzkIAgzz9JF.webp",
                        "order": 25,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 338,
                        "name": "Peeling & Paring Knives",
                        "slug": "peeling-knives-paring-knives",
                        "parent_id": 81,
                        "productCount": 176,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/C5irYuPbSULEZpk5hVShBlKpvxopccuNJfyPMnmN.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 329,
                        "name": "Slicing Knives",
                        "slug": "slicing-knives",
                        "parent_id": 81,
                        "productCount": 41,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Zx2qjmUdtqqaCCytVSsneAb27dk8LcCwGfpLdvhY.webp",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 340,
                        "name": "Steak Knives",
                        "slug": "steak-knives",
                        "parent_id": 81,
                        "productCount": 98,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UoS45RxtlY80STE9t7cbifmvN3kE7MmPE4oBK43b.webp",
                        "order": 28,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 341,
                        "name": "Utility Knives",
                        "slug": "utility-knives",
                        "parent_id": 81,
                        "productCount": 134,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7cqp7gh6nyBaY0sZmM4SqwZPAbwDglFI90dfXCTT.webp",
                        "order": 29,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 346,
                        "name": "Bread \/ Sandwich Knives",
                        "slug": "bread-knives-sandwich-knives",
                        "parent_id": 81,
                        "productCount": 142,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/IsmKVUovEcWjcD1lgYdruNTTBUBbYmOwj5EZ5wPr.webp",
                        "order": 30,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 342,
                        "name": "Knife Set And Holder",
                        "slug": "knife-set-holder",
                        "parent_id": 81,
                        "productCount": 244,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ez1u8QTzifTaS4j4WntpjDQhoU4zo4b3teqCe5IR.webp",
                        "order": 31,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 334,
                        "name": "Fillet Knife",
                        "slug": "fillet-knife",
                        "parent_id": 81,
                        "productCount": 39,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/iqodhELec4wh1pzx4jmzfK5QQaQs2XRuI7PtsFzI.png",
                        "order": 34,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 337,
                        "name": "Clam Knives and Oyster Knives",
                        "slug": "clam-knives-oyster-knives",
                        "parent_id": 81,
                        "productCount": 26,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/qv90Uwiw4GBPYArP8LaF3qiqKxVL2gTtJHybh23X.webp",
                        "order": 38,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 336,
                        "name": "Knife Sharpener",
                        "slug": "knife-sharpener",
                        "parent_id": 81,
                        "productCount": 116,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/h0uvsX4k4DOpaVAkKEwc2ZtDmVlE6f7o9d4xev5U.webp",
                        "order": 39,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 332,
                        "name": "Butcher Knives",
                        "slug": "butcher-knives",
                        "parent_id": 81,
                        "productCount": 63,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/dOXqk0lq80D7orwQ0VUYxeGyQdT3YlEEh7XxowVM.webp",
                        "order": 40,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 82,
                "name": "Baking Tools And Supplies",
                "slug": "baking-tools-supplies",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/baking-tools-and-supplies-1.png",
                "order": 5,
                "children": [
                    {
                        "id": 276,
                        "name": "Whisks & Cooking Whips",
                        "slug": "whisks-cooking-whips",
                        "parent_id": 82,
                        "productCount": 61,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UVQvOW6MAMKbou4eogBok2meQz3z6ls9zZv7mADw.webp",
                        "order": 1,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 303,
                        "name": "Bread Slicer",
                        "slug": "bread-slicer",
                        "parent_id": 82,
                        "productCount": 7,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/cwInkiuPLx6iBFY0eekNFbhrkfzRwthQ9MS1G00n.webp",
                        "order": 2,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 304,
                        "name": "Baking & Casserole Dishes",
                        "slug": "baking-dishes-casserole-dishes",
                        "parent_id": 82,
                        "productCount": 143,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/rAeIfEqrIwZSJTk95AhLLCAHTfjk53jCNKsWgJ7b.webp",
                        "order": 3,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 324,
                        "name": "Baking Pans",
                        "slug": "baking-pans",
                        "parent_id": 82,
                        "productCount": 0,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/wb2UUmlWm7KuNroJ4pKFsEfho4O3U3h7FGD4G772.webp",
                        "order": 14,
                        "children": [
                            {
                                "id": 881,
                                "name": "Baking Molds \/ Pastry Molds",
                                "slug": "baking-molds-pastry-molds",
                                "parent_id": 324,
                                "productCount": 15,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/z0z58cCakIpaachlw475IrUtQwDqorTSNmVTex5w.png",
                                "order": 16,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 877,
                                "name": "Cake Pan",
                                "slug": "cake-pan",
                                "parent_id": 324,
                                "productCount": 91,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/OcabV52YQp9flgpcH7asXBBteZ0nnlO6yRQtJ6mc.webp",
                                "order": 17,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 327,
                                "name": "Sheet Pan",
                                "slug": "sheet-pan",
                                "parent_id": 324,
                                "productCount": 103,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/baking-pans-sheets-and-trays-3.png",
                                "order": 18,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 878,
                                "name": "Bread & Loaf Pan",
                                "slug": "bread-loaf-pan",
                                "parent_id": 324,
                                "productCount": 20,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7S5jkYzGK4vyNqS4Xj61ChLeq9Rbhblo2UYQbfgF.png",
                                "order": 19,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 879,
                                "name": "Cupcakes & Muffin Pan",
                                "slug": "cupcake-muffin-pans",
                                "parent_id": 324,
                                "productCount": 19,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/7CJW5IvpQ1qYTOZFbrSBYMDktzQZCxfh46MPaV8P.png",
                                "order": 22,
                                "children": [],
                                "last_children": []
                            },
                            {
                                "id": 880,
                                "name": "Roasting Pan",
                                "slug": "roasting-pans",
                                "parent_id": 324,
                                "productCount": 20,
                                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/EUKIKdKLkRK0empjcuduC2X4mAgMA6aCOU82MOmK.png",
                                "order": 23,
                                "children": [],
                                "last_children": []
                            }
                        ],
                        "last_children": []
                    },
                    {
                        "id": 326,
                        "name": "Reusable Baking Mat and Pan Liners",
                        "slug": "baking-mats",
                        "parent_id": 82,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/baking-mats-1.png",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 516,
                        "name": "Cake and Dessert Stands",
                        "slug": "cake-dessert-stands",
                        "parent_id": 82,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/dessert-and-cake-stands-1.png",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 913,
                        "name": "Oven Mitts, Gloves, & Pot Holders",
                        "slug": "oven-mitts-gloves-pot-holders",
                        "parent_id": 82,
                        "productCount": 29,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/NCso8YZwz0lepvQa1Vb1P71oOXPp6IGfaI46JaYY.png",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 959,
                        "name": "Cream Dispensers & Chargers",
                        "slug": "cream-dispensers-chargers",
                        "parent_id": 82,
                        "productCount": 6,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/smoAzzBS9RhS4DKEH223SJL6Y3SIu4L929tTKRqt.png",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 310,
                        "name": "Cake & Pie Server",
                        "slug": "cake-pie-server",
                        "parent_id": 82,
                        "productCount": 18,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cake-pie-server.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 739,
                        "name": "Cooling Rack",
                        "slug": "cooling-rack",
                        "parent_id": 82,
                        "productCount": 11,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FsSeGIezIh2INWlHrjPJaWAK7VwDzxMkmdoswyUa.webp",
                        "order": 26,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 305,
                        "name": "Icing Spatula",
                        "slug": "icing-spatula",
                        "parent_id": 82,
                        "productCount": 26,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/icing-spatulas.webp",
                        "order": 27,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 307,
                        "name": "Cake Turntable & Decorating Stands",
                        "slug": "cake-turntable-decorating-stands",
                        "parent_id": 82,
                        "productCount": 8,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cake-stands-turntables.webp",
                        "order": 28,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 313,
                        "name": "Piping Tips, Pastry Bags, and Accessories",
                        "slug": "piping-tips-pastry-bags-accessories",
                        "parent_id": 82,
                        "productCount": 23,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/piping-tubes-and-bags-1.png",
                        "order": 30,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 314,
                        "name": "Basting Brush and Pastry Brush",
                        "slug": "basting-brush-pastry-brush",
                        "parent_id": 82,
                        "productCount": 45,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/hrnPHACdwFHn1Z6e2nKylitndIHenMj2dgD1jiJC.webp",
                        "order": 31,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 83,
                "name": "Kitchen Supplies",
                "slug": "kitchen-supplies",
                "parent_id": 76,
                "productCount": 11,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/kitchen-supplies.png",
                "order": 6,
                "children": [
                    {
                        "id": 905,
                        "name": "Colanders",
                        "slug": "colanders",
                        "parent_id": 83,
                        "productCount": 79,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/DK3f41hJtra2jBCIsRvTZ6y3URngzQz6I9I1b38O.png",
                        "order": 43,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 749,
                        "name": "Turners",
                        "slug": "turners",
                        "parent_id": 83,
                        "productCount": 247,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/FBg7BiC8iX4zSe4Z20gBEwoAlIRGRnh6QL6T2O8t.png",
                        "order": 45,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 901,
                        "name": "Food Dishers",
                        "slug": "food-dishers",
                        "parent_id": 83,
                        "productCount": 116,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/5ZVu5wFne6LgFvT10qOa9KjbiMpPMYkmIAYj85p0.png",
                        "order": 46,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 274,
                        "name": "Cutting Boards",
                        "slug": "cutting-boards",
                        "parent_id": 83,
                        "productCount": 180,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/f1qnkvxRf9QMCKMUr5vaOAe5mMHBeNwlknUlRCWd.webp",
                        "order": 53,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 526,
                        "name": "Funnel",
                        "slug": "funnel",
                        "parent_id": 83,
                        "productCount": 15,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/wYBOtdVIoBNHFmxEaYqLQhLROgNyFdFysAVHMxuK.webp",
                        "order": 54,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 295,
                        "name": "Graters",
                        "slug": "graters",
                        "parent_id": 83,
                        "productCount": 29,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/nBjuu6kOAQRKrNuZKhlyVfOy0yHIUYS4csesN75p.webp",
                        "order": 55,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 293,
                        "name": "Ladles",
                        "slug": "ladles",
                        "parent_id": 83,
                        "productCount": 177,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/sUwjtsJOMSY6uQ9rXUkQoDbxDnyksxGtKobYo3xZ.webp",
                        "order": 58,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 297,
                        "name": "Mixing Bowls",
                        "slug": "mixing-bowls",
                        "parent_id": 83,
                        "productCount": 94,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UEKjdksXiKpFyADB1Qj4VCwsmGAkoRoqhS1yi7Wg.webp",
                        "order": 59,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 280,
                        "name": "Scraper",
                        "slug": "scraper",
                        "parent_id": 83,
                        "productCount": 105,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/I6bUcK1Aql4TwUlgXWbs0ez8T4BcSRuveSpFg2NQ.webp",
                        "order": 61,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 288,
                        "name": "Serving Spoons And Tongs",
                        "slug": "serving-spoons-serving-tongs",
                        "parent_id": 83,
                        "productCount": 462,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/6opFdCrrI0VCwR4C8BYSimxWRDJFjuG1xJgJ3NhO.webp",
                        "order": 62,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 296,
                        "name": "Strainers",
                        "slug": "strainers",
                        "parent_id": 83,
                        "productCount": 162,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/T7yC1MCbxel7q2cMipiz9h8knaJIjecZKZBDxoNs.webp",
                        "order": 64,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 290,
                        "name": "Portion Spoons & Scoop",
                        "slug": "portion-spoons-portion-scoop",
                        "parent_id": 83,
                        "productCount": 76,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/TzyzsSIDaBGY7vUPN2NwcsOS9UX8XvDNBVNeHfAS.webp",
                        "order": 65,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 294,
                        "name": "Kitchen Timer And Thermometer",
                        "slug": "kitchen-timer-kitchen-thermometer",
                        "parent_id": 83,
                        "productCount": 235,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/YTpyp3vpQfPYYUqhtjUG9dIkgFgHUwzLX40AnuHH.webp",
                        "order": 66,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 745,
                        "name": "Kitchen Spoon",
                        "slug": "kitchen-spoon",
                        "parent_id": 83,
                        "productCount": 89,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/2Y8pIFhzJ3QZTznpOYYoX9fTGlSFtJyM9g1zmWHO.webp",
                        "order": 67,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 746,
                        "name": "Skimmer",
                        "slug": "skimmer",
                        "parent_id": 83,
                        "productCount": 79,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UgHlbUH1zaqrzVcckEkERM1I3nzSDyvf4uT5ffk5.webp",
                        "order": 68,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 943,
                        "name": "Breading Basket",
                        "slug": "breading-basket",
                        "parent_id": 83,
                        "productCount": 21,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ctQcmghjFN9naX3WYaIhVrcZnWF1gC6rQ4BQxxuW.png",
                        "order": 69,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 958,
                        "name": "Kitchen Torches & Fuel",
                        "slug": "kitchen-torches-fuel",
                        "parent_id": 83,
                        "productCount": 3,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/YWwYxwFpX5yr0CywzHvSGkVH2Bk1dZXExGhjBRAf.png",
                        "order": 70,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 277,
                        "name": "Kitchen Shears",
                        "slug": "kitchen-shears",
                        "parent_id": 83,
                        "productCount": 31,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/kitchen-shears.webp",
                        "order": 71,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 320,
                        "name": "Cooling Tray",
                        "slug": "cooling-tray",
                        "parent_id": 83,
                        "productCount": 9,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/cooling-trays-3.png",
                        "order": 76,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 283,
                        "name": "Can Opener",
                        "slug": "can-opener",
                        "parent_id": 83,
                        "productCount": 30,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/categories-images-25.png",
                        "order": 77,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 747,
                        "name": "Peeler",
                        "slug": "peeler",
                        "parent_id": 83,
                        "productCount": 26,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/MEdx4ko2romQ1rjDpMB8FEEHMiNXcA4TJoDApMez.png",
                        "order": 81,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 750,
                        "name": "Slicer",
                        "slug": "slicer",
                        "parent_id": 83,
                        "productCount": 44,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/4gUnF6XRSjknI209yaDbzYOPYiCoTuFJcq9feVgP.png",
                        "order": 82,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 662,
                        "name": "Brushes",
                        "slug": "brushes",
                        "parent_id": 83,
                        "productCount": 14,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/UVnnHayjUnh9vpkWt7HrOKf9RIMqNmEedtLA19xU.webp",
                        "order": 83,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 748,
                        "name": "Spatula",
                        "slug": "spatula",
                        "parent_id": 83,
                        "productCount": 79,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/T1R1gXLjLp64UoRbBMPN6knxtOnK6ht3L8Kp35TJ.png",
                        "order": 84,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 514,
                        "name": "Equipment Cleaning Tools & Supplies",
                        "slug": "kitchen-cleaning-tools-supplies",
                        "parent_id": 83,
                        "productCount": 11,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/kitchen-cleaning-tools-supplies.webp",
                        "order": 85,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 286,
                        "name": "Potato Masher",
                        "slug": "potato-masher-and-ricers",
                        "parent_id": 83,
                        "productCount": 22,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/potato-masher-and-ricers-2.png",
                        "order": 87,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 292,
                        "name": "Measuring Cups & Measuring Spoons",
                        "slug": "measuring-cups-measuring-spoons",
                        "parent_id": 83,
                        "productCount": 64,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/categories-images-26.png",
                        "order": 89,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 939,
                        "name": "Meat Tenderizer",
                        "slug": "meat-tenderizer",
                        "parent_id": 83,
                        "productCount": 10,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/Kk2wVyMpcpNzcwy4u9c8PSaD9R3t06imnDbga1Wn.png",
                        "order": 91,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 900,
                        "name": "Egg Rings",
                        "slug": "egg-rings",
                        "parent_id": 83,
                        "productCount": 13,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/SmSSizBOqRqCAOuXF9g3nCHwIGnf4t96iu4jTw4O.png",
                        "order": 92,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 513,
                        "name": "BBQ Accessories",
                        "slug": "bbq-accessories",
                        "parent_id": 83,
                        "productCount": 30,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/bbq-accessories.webp",
                        "order": 93,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 282,
                        "name": "Rolling Pin",
                        "slug": "rolling-pins",
                        "parent_id": 83,
                        "productCount": 16,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/OXaXhi08muB31HjD4fm9aiBV9PiuDDPxudhoyBde.webp",
                        "order": 94,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 894,
                        "name": "Food Mills",
                        "slug": "food-mills",
                        "parent_id": 83,
                        "productCount": 11,
                        "image": "https:\/\/horecastore-s3-storage.s3.us-west-1.amazonaws.com\/categories\/0mSiqLypVd7P7ZXpETblHRBPloAHf3WHXy7nOLjC.png",
                        "order": 95,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            },
            {
                "id": 89,
                "name": "Hotel and Restaurant Linens",
                "slug": "hotel-restaurant-linens",
                "parent_id": 76,
                "productCount": 0,
                "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/categories\/restaurant-linen-chef-apparel.png",
                "order": 7,
                "children": [
                    {
                        "id": 262,
                        "name": "Bar Towels \/ Kitchen Towels",
                        "slug": "bar-towels-kitchen-towels",
                        "parent_id": 89,
                        "productCount": 14,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/fbQNmQRisDZv9z7risn0I9e2UeM0fmHcb7kKpx6d.webp",
                        "order": 15,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 265,
                        "name": "Chef Coats",
                        "slug": "chef-coats",
                        "parent_id": 89,
                        "productCount": 54,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/jnnx04PREr517VHSgh0w0yFAYznO8bj02A6BSgFX.webp",
                        "order": 16,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 270,
                        "name": "Chef Hats & Headwear",
                        "slug": "chef-hats-chef-headwear",
                        "parent_id": 89,
                        "productCount": 35,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/l3MGIxP6Ti0C84pary3PJwLEDb5SSGmfdXYH9Rj6.webp",
                        "order": 17,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 267,
                        "name": "Chef Pants",
                        "slug": "chef-pants",
                        "parent_id": 89,
                        "productCount": 34,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/1tA6k0utbVk2yX3o23jN5ZsRZjoTMDmnyKoTuQXC.webp",
                        "order": 18,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 268,
                        "name": "Cook Shirts",
                        "slug": "cook-shirts",
                        "parent_id": 89,
                        "productCount": 36,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/ZIjzxVA0LYoasmW0z2MecpteGXvTHKX7dvEnLvmk.webp",
                        "order": 19,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 259,
                        "name": "Kitchen Gloves",
                        "slug": "kitchen-gloves",
                        "parent_id": 89,
                        "productCount": 39,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/xNCOdS8yhM7kql4wtsQcIpIwSBirmpWEECpF0g1c.webp",
                        "order": 20,
                        "children": [],
                        "last_children": []
                    },
                    {
                        "id": 264,
                        "name": "Restaurant Aprons",
                        "slug": "restaurant-aprons",
                        "parent_id": 89,
                        "productCount": 54,
                        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/zqJkDvBpC5VXjlAbhltgdLDZL6ydNP4Sm4dEvoMr.webp",
                        "order": 21,
                        "children": [],
                        "last_children": []
                    }
                ],
                "last_children": []
            }
        ],
        "last_children": []
    },
    {
        "id": 380,
        "name": "Shop By Brands",
        "slug": "shop-by-brands",
        "parent_id": 0,
        "productCount": 29,
        "image": "https:\/\/d1p9kdrbe10xzz.cloudfront.net\/categories\/AwxVWuCkew3Nnze4ajUFB8zPK8VIkhoU3wMYvIya.webp",
        "order": 10,
        "children": [],
        "last_children": []
    }
]

// ── getCategoryPath helper ─────────────────────────────────────────────────────
const getCategoryPath = (cat: Category): string => {
  if (cat.slug === "shop-by-brands") return "/all-brands";
  if (cat.slug === "sale") return "/sale";
  return `/${cat.slug}`;
};


// ══════════════════════════════════════════════════════════════════════════════
// DropdownPanel
// ══════════════════════════════════════════════════════════════════════════════
interface DropdownPanelProps {
  category: Category;
  setChildCategory?:      (c: Category[]) => void;
  setGrandChildCategory?: (c: Category[]) => void;
  onClose: () => void;
  onPanelMouseEnter: () => void;
  onPanelMouseLeave: () => void;
}

function DropdownPanel({
  category,
  setChildCategory,
  setGrandChildCategory,
  onClose,
  onPanelMouseEnter,
  onPanelMouseLeave,
}: DropdownPanelProps) {
  const [activeChild, setActiveChild] = useState<Category | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Reset to first child whenever parent category changes — same as React JS */
  useEffect(() => {
    const first = category?.children?.[0] ?? null;
    setActiveChild(first);
    setGrandChildCategory?.(first?.children ?? []);
    setChildCategory?.(category?.children ?? []);
  }, [category]);

  const handleChildHover = (child: Category) => {
    setActiveChild(child);
    setGrandChildCategory?.(child?.children ?? []);
  };

  if (!category?.children?.length) return null;

  const grandChildren = activeChild?.children ?? [];

  return (
    <>
      <style>{`
        /* ── Keyframes (same names as original global CSS) ── */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scaleY(0.97); }
          to   { opacity: 1; transform: translateY(0)     scaleY(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes scaleY {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes ringSpin { to { transform: rotate(360deg); } }

        .animate-slideDown  { animation: slideDown  0.22s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fadeIn     { animation: fadeIn     0.2s  ease-out              both; }
        .animate-fadeInUp   { animation: fadeInUp   0.22s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-scaleY     { animation: scaleY     0.18s ease-out              forwards; transform-origin: top; }

        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar       { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

        /* Mega sale pill */
        .mega-sale-pill {
          position: relative;
          background: linear-gradient(145deg, #ff3b0a, #ff0000);
          border-radius: 7px;
          overflow: hidden;
          z-index: 1;
          box-shadow: 0 10px 25px rgba(255,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.35);
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
        }
        .mega-sale-pill:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 16px 35px rgba(255,0,0,0.6), 0 0 25px rgba(255,0,0,0.45);
        }
        .confetti-ring {
          position: absolute; inset: -3px; border-radius: inherit;
          background: conic-gradient(from 0deg,#ff0,#ff3b0a,#00e5ff,#ff00c8,#22c55e,#ff0);
          z-index: 0; filter: blur(6px);
          animation: ringSpin 4s linear infinite;
        }
        .mega-sale-pill::after {
          content: ""; position: absolute; inset: 3px; border-radius: inherit;
          background: linear-gradient(145deg, #ff3b0a, #ff0000); z-index: 0;
        }
        .sale-label { position: relative; z-index: 10; }
      `}</style>

      <div
        ref={panelRef}
        className="absolute left-0 top-full bg-white shadow-xl border border-gray-200 z-50 w-full animate-slideDown"
        onMouseEnter={() => {
          onPanelMouseEnter();
          setChildCategory?.(category.children ?? []);
        }}
        onMouseLeave={onPanelMouseLeave}
      >
        <div className="global-container px-6 py-6">
          <div className="grid grid-cols-12 gap-6">

            {/* ── LEFT SIDEBAR ── */}
            <div className="col-span-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-1">
                {category.children!.map((child, index) => (
                  <Link
                    key={child.id}
                    href={`/${category.slug}/${child.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => handleChildHover(child)}
                    className={`
                      group relative block w-full px-4 py-3 rounded-lg
                      transition-all duration-200 ease-in-out animate-fadeIn
                      ${
                        activeChild?.id === child.id
                          ? "bg-green-50 text-green-700 font-normal shadow-sm"
                          : "bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }
                    `}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm leading-tight">{child.name}</span>
                      <ChevronRight
                        size={16}
                        className={`transition-all duration-200 flex-shrink-0 ${
                          activeChild?.id === child.id
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </div>

                    {/* Active indicator bar */}
                    {activeChild?.id === child.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full animate-scaleY" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="col-span-9 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {grandChildren.length > 0 ? (
                <div className="grid 2xl:grid-cols-6 grid-cols-5 gap-4 pb-2">
                  {grandChildren.map((grandChild, index) => (
                    <Link
                      key={grandChild.id}
                      href={`/${category.slug}/${activeChild?.slug}/${grandChild.slug}`}
                      onClick={onClose}
                      className="
                        group flex flex-col items-center text-center
                        p-4 rounded-xl bg-gray-50
                        hover:bg-white hover:shadow-lg hover:-translate-y-1
                        transition-all duration-300 ease-out
                        cursor-pointer border border-transparent hover:border-green-100
                        animate-fadeInUp
                      "
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-white">
                        {grandChild.image ? (
                          <>
                            <img
                              src={grandChild.image}
                              alt={grandChild.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-out"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-colors duration-300" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                        )}
                      </div>

                      {/* Label */}
                      <span className="text-xs font-medium text-gray-700 group-hover:text-green-700 leading-tight break-words line-clamp-2 transition-colors duration-200">
                        {grandChild.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <p className="text-4xl mb-3">📂</p>
                    <p className="text-sm">No subcategories available</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// HeaderMenu
// ══════════════════════════════════════════════════════════════════════════════
const HeaderMenu = () => {
  const [activeCategory, setActiveCategory]         = useState<Category | null>(null);
  const [isDropdownOpen, setIsDropdownOpen]         = useState(false);
  const [childCategory, setChildCategory]           = useState<Category[]>([]);
  const [grandChildCategory, setGrandChildCategory] = useState<Category[]>([]);

  /* Scroll arrows */
  const scrollRef          = useRef<HTMLDivElement>(null);
  const menuRef            = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow,  setShowLeftArrow]  = useState(false);

  /* Shared close timer — same as React JS closeTimeoutRef */
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Scroll arrows (same as React JS) ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
      setShowLeftArrow(scrollLeft > 0);
    };
    checkScroll();
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const doScrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  const doScrollLeft  = () => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });

  /* ── handleCloseDropdown — 150ms delay (same as React JS) ── */
  const handleCloseDropdown = useCallback(() => {
    clearTimeout(closeTimeoutRef.current!);
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
      setActiveCategory(null);
    }, 150);
  }, []);

  /* Cancel scheduled close when cursor enters panel */
  const cancelClose = useCallback(() => {
    clearTimeout(closeTimeoutRef.current!);
  }, []);

  /* ── handleMouseEnter — instant open, same as React JS ── */
  const handleMouseEnter = useCallback(
    (category: Category) => {
      clearTimeout(closeTimeoutRef.current!);

      /* No children or brands → schedule close */
      if (!category.children?.length || category.slug === "shop-by-brands") {
        handleCloseDropdown();
        return;
      }

      /* Instant open + set state — exactly like React JS version */
      setActiveCategory(category);
      setChildCategory(category.children ?? []);
      setGrandChildCategory(category.children?.[0]?.children ?? []);
      setIsDropdownOpen(true);
    },
    [handleCloseDropdown],
  );

  /* Immediate close on link click */
  const closeNow = useCallback(() => {
    clearTimeout(closeTimeoutRef.current!);
    setIsDropdownOpen(false);
    setActiveCategory(null);
  }, []);

  /* Cleanup */
  useEffect(() => {
    return () => clearTimeout(closeTimeoutRef.current!);
  }, []);

  /* ── Click outside (same as React JS mousedown listener) ── */
  useEffect(() => {
    const handleMouseOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleMouseOutside);
    return () => document.removeEventListener("mousedown", handleMouseOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative w-full bg-green-700 py-3 border-b border-green-800 hidden lg:block"
    >
      <div className="global-container">
        <div className="grid grid-cols-[75%_25%]">

          {/* ── LEFT: scrollable category links ── */}
          <div className="relative flexw items-center">
            {/* {showLeftArrow && (
              <button
                onClick={doScrollLeft}
                className="absolute left-0 bg-gradient-to-r from-green-700/100 to-transparent h-full pr-4 pl-1 flex items-center z-10"
              >
                <MoveLeft size={14} className="text-white" />
              </button>
            )} */}

            <div
              ref={scrollRef}
              className="flex space-x-4 items-center overflow-x-aueto scrollbar-hide scroll-smooth"
            >
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={getCategoryPath(category)}
                  onMouseEnter={() => handleMouseEnter(category)}
                  onClick={closeNow}
                  className={`
                    text-white transition-colors duration-200
                    cursor-pointer relative group flex items-center gap-1
                    md:text-[15px] lg:text-[14px] text-xs whitespace-nowrap
                    ${activeCategory?.id === category.id && isDropdownOpen ? "font-normal" : "font-normal"}
                    hover:font-bold
                  `}
                >
                  {category.name}
                  {category.slug !== "shop-by-brands" && (
                    <ChevronDown size={15} className="text-white opacity-80" />
                  )}
                </Link>
              ))}
            </div>

            {/* {showRightArrow && (
              <button
                onClick={doScrollRight}
                className="absolute right-0 bg-gradient-to-l from-green-700/100 to-transparent h-full pl-4 pr-1 flex items-center z-10"
              >
                <MoveRight size={14} className="text-white" />
              </button>
            )} */}
          </div>

          {/* ── RIGHT: phone · financing · sale ── */}
         <div> <div className="flex gap-3 items-center justify-end text-white font-normal">
            {/* Phone */}
            <a
              href="tel:+18664467322"
              className="hover:font-semibold transition-colors duration-200 2xl:text-[15px] md:text-[13px] text-xs flex gap-1 items-center test-phone"
              style={{ textDecoration: "none" }}
            >
              <Phone className="w-4 h-4" />
           +1 (866) 446-7322
            </a>

            {/* Financing */}
            <button
              className="hover:font-semibold transition-colors duration-200 2xl:text-[15px] md:text-[14px] text-xs bg-transparent border-none text-white cursor-pointer"
              onClick={() => alert("Get a Financing Quote")}
            >
              Financing
            </button>

            {/* Mega Sale */}
            {/* <Link href="/sale" style={{ textDecoration: "none" }}>
              <button className="mega-sale-pill px-5 py-2 font-extrabold text-white tracking-wider">
                <span className="sale-label relative z-10">Mega Sale</span>
                <span className="confetti-ring" />
              </button>
            </Link> */}
          </div></div>

        </div>
      </div>

      {/*
        ── DropdownPanel
        key={activeCategory.id}  ← ensures React fully remounts panel
        on category switch so useEffect resets activeChild every time.
      */}
      {activeCategory &&
        activeCategory.slug !== "shop-by-brands" &&
        isDropdownOpen && (
          <DropdownPanel
            key={activeCategory.id}
            category={activeCategory}
            setChildCategory={setChildCategory}
            setGrandChildCategory={setGrandChildCategory}
            onClose={closeNow}
            onPanelMouseEnter={cancelClose}
            onPanelMouseLeave={handleCloseDropdown}
          />
        )}
    </div>
  );
};

export default HeaderMenu;