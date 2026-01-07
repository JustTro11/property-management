import { createClient } from '@/lib/supabaseServer'
import { Link, redirect } from '@/lib/navigation'
import { Plus, Pencil, Home } from 'lucide-react'
import PropertyThumbnail from '@/components/PropertyThumbnail'
import DeletePropertyButton from '@/components/DeletePropertyButton'

export default async function AdminDashboard({
    params
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect({ href: '/login', locale })
    }

    const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-bg-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                        <p className="mt-1 text-zinc-500 dark:text-zinc-400">Manage your property listings</p>
                    </div>
                    <Link
                        href="/admin/add"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-indigo-500/20"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Add Property
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
                    <ul role="list" className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {properties && properties.length > 0 ? (
                            properties.map((property) => (
                                <li key={property.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0 gap-4">
                                                <div className="h-16 w-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                                    <PropertyThumbnail
                                                        src={property.image_url}
                                                        alt={property.title}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{property.title}</p>
                                                    <p className="mt-1 flex items-center text-sm text-zinc-500">
                                                        <span className="truncate">{property.address}</span>
                                                    </p>
                                                    <p className="mt-1 flex items-center text-xs text-zinc-400 dark:text-zinc-600">
                                                        ${property.price.toLocaleString()}/mo • {property.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 ml-4 gap-2">
                                                <Link
                                                    href={`/admin/edit/${property.id}`}
                                                    className="inline-flex items-center p-2 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-text-primary dark:hover:text-white transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeletePropertyButton
                                                    propertyId={property.id}
                                                    propertyTitle={property.title}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-12 text-center text-zinc-500">
                                <Home className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                                <p>No properties found.</p>
                                <Link href="/admin/add" className="mt-2 text-indigo-600 dark:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400">Get started by adding one.</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
