import Link from "next/link";

export default function NotFound() {
    return (
         <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="text-center max-w-md w-full">
          {/* Icon */}
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#186737]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>

          {/* Text */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">
            Product Not Found
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed">
            The product you&apos;re looking for doesn&apos;t exist or may have been removed.
            Browse our catalog to find what you need.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c2f] transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#186737] text-[#186737] text-sm font-semibold hover:bg-green-50 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
}