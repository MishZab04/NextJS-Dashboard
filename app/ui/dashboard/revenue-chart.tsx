import { generateYAxis } from "@/app/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { Revenue } from "@/app/lib/definitions";

export default async function RevenueChart({
  revenue,
}: {
  revenue: Revenue[];
}) {
  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div
          className="grid gap-4 sm:grid-cols-13"
          style={{ height: `${chartHeight}px` }}
        >
          {/* Y-axis */}
          <div className="flex flex-col justify-between text-sm text-gray-400">
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {/* Bars */}
          <div className="col-span-12 flex items-end gap-2">
            {revenue.map((month) => (
              <div
                key={month.month}
                className="flex w-full flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-md bg-blue-300"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                ></div>
                <p className="text-sm text-gray-400">{month.month}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-5 w-5" />
          Last 12 months
        </div>
      </div>
    </div>
  );
}
