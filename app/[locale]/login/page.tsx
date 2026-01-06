import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background blobs for premium feel */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <AuthForm />
        </div>
    )
}
