import { ChevronLeft } from "lucide-react";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader } from "./ui/card";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8 border-none rounded-lg">
        <div className="text-2xl font-bold">
          <div className="flex justify-between pr-6 pl-2">
            <p className="flex items-center gap-2">
              <ChevronLeft className="cursor-pointer" /> Profile
            </p>
          </div>
          <Separator className="my-4 border-gray-300 dark:border-gray-800 shadow-sm" />
        </div>

        {/* Profile Header Skeleton */}
        <div className="mb-8 flex items-center gap-6 bg-card p-6 rounded-lg shadow-lg dark:bg-gray-800">
          <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Chart Skeleton */}
        <Card className="mb-8 dark:bg-gray-800">
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
