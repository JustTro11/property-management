export default function Loading() {
    return (
        <div className="min-h-screen bg-bg-primary pt-32 pb-12 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-center animate-pulse">
                    <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-4" />
                    <div className="h-6 w-96 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto" />
                </div>

                {/* Filters Skeleton */}
                <div className="mb-10 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-border-color">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Property Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-bg-card dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-2xl overflow-hidden h-full flex flex-col"
                        >
                            {/* Image Skeleton */}
                            <div className="h-64 bg-zinc-200 dark:bg-zinc-800 animate-pulse relative">
                                <div className="absolute top-4 left-4 w-20 h-6 bg-zinc-300 dark:bg-zinc-700/50 rounded-full" />
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-5 flex-grow space-y-4">
                                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
                                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 animate-pulse" />
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 animate-pulse" />

                                <div className="pt-4 border-t border-border-color dark:border-zinc-800 flex justify-between">
                                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
