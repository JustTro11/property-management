import AdminPropertyForm from '@/components/AdminPropertyForm'
import { createClient } from '@/lib/supabaseServer'
import { ArrowLeft } from 'lucide-react'
import { Link, redirect } from '@/lib/navigation'
import { notFound } from 'next/navigation'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id, locale } = await params
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect({ href: '/login', locale })
    }

    const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

    if (!property) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-bg-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-text-primary dark:hover:text-white transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-text-primary">Edit Property</h1>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">Update details for {property.title}</p>
                </div>

                <AdminPropertyForm initialData={property} />
            </div>
        </div>
    )
}
