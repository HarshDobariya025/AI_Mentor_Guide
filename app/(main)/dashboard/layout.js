import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold md:text-5xl lg:text-5xl xl:text-5xl bg-gradient-to-b from-gray-500 via-gray-200 to-gray-500 text-transparent bg-clip-text">Industry Insights</h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />} //loading indicator
      >
        {children}
      </Suspense>
    </div>
  );
}