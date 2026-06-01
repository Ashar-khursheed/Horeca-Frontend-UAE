"use client";

import React, { useState } from "react";
import type { Spec } from "./types";

type SpecificationsSectionProps = {
  specifications: { left: Spec[]; right: Spec[] };
};

const MOBILE_LIMIT = 6;

export const SpecificationsSection = ({
  specifications,
}: SpecificationsSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  const allSpecs = [...specifications.left, ...specifications.right];
  const rows: (typeof allSpecs)[] = [];
  for (let i = 0; i < allSpecs.length; i += 3) {
    rows.push(allSpecs.slice(i, i + 3));
  }

  const mobileSpecs = showAll ? allSpecs : allSpecs.slice(0, MOBILE_LIMIT);

  return (
    <div>
      {/* Mobile: simple list with show more */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-100">
          {mobileSpecs.map((spec, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 gap-4">
              <span className="text-[13px] text-gray-500 font-medium shrink-0">
                {spec.attribute_name}
              </span>
              <span className="text-[13px] text-gray-800 font-semibold text-right">
                {spec.attribute_value}
              </span>
            </div>
          ))}
        </div>
        {allSpecs.length > MOBILE_LIMIT && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-3 text-[13px] text-[#186737] font-semibold hover:underline"
          >
            {showAll
              ? "Show Less"
              : `See All Specs (${allSpecs.length - MOBILE_LIMIT} more)`}
          </button>
        )}
      </div>

      {/* Desktop: 3-column table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                {row.map((spec, ci) => (
                  <React.Fragment key={ci}>
                    <td className="px-4 py-3 text-gray-800 font-semibold w-[16%] border border-gray-100 whitespace-nowrap">
                      {spec.attribute_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-medium w-[17%] border border-gray-100">
                      {spec.attribute_value}
                    </td>
                  </React.Fragment>
                ))}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, ei) => (
                    <React.Fragment key={ei}>
                      <td className="border border-gray-100" />
                      <td className="border border-gray-100" />
                    </React.Fragment>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
