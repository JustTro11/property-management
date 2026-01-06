import AdminPropertyForm from '@/components/AdminPropertyForm'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/lib/navigation'

export default function AddPropertyPage() {
    return (
        <div className="min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Add New Property</h1>
                    <p className="mt-1 text-zinc-400">Create a new listing for your portfolio.</p>
                </div>

                <AdminPropertyForm />
            </div>
        </div>
    )
}
