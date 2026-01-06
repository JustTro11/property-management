'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from '@/lib/navigation'
import { Loader2 } from 'lucide-react'
import { Property } from '@/types'
import { useForm, SubmitHandler } from 'react-hook-form'

interface PropertyFormData extends Omit<Property, 'id' | 'created_at' | 'images'> {
    imagesStr: string
}

export default function AdminPropertyForm({ initialData }: { initialData?: Property }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<PropertyFormData>({
        defaultValues: initialData ? {
            ...initialData,
            imagesStr: initialData.images && initialData.images.length > 0
                ? initialData.images.join('\n')
                : initialData.image_url || ''
        } : {
            title: '',
            price: 0,
            address: '',
            description: '',
            image_url: '',
            sqft: 0,
            bedrooms: 0,
            bathrooms: 0,
            status: 'available',
            imagesStr: ''
        }
    })

    const imagesStr = watch('imagesStr')
    const imagesPreview = imagesStr
        ? imagesStr.split('\n').filter(url => url.trim() !== '')
        : []

    const onSubmit: SubmitHandler<PropertyFormData> = async (data) => {
        setLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                throw new Error("Not authenticated")
            }

            // Process images
            const images = data.imagesStr.split('\n').filter(url => url.trim() !== '')
            const mainImage = images[0] || ''

            const propertyData = {
                title: data.title,
                price: Number(data.price),
                address: data.address,
                description: data.description,
                image_url: mainImage,
                images: images,
                sqft: Number(data.sqft),
                bedrooms: Number(data.bedrooms),
                bathrooms: Number(data.bathrooms),
                status: data.status
            }

            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('properties')
                    .update(propertyData)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('properties')
                    .insert([propertyData])
                if (error) throw error
            }

            router.push('/admin')
            router.refresh()
        } catch (error) {
            alert('Error saving property')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-400">
                        Property Title
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="title"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.title ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-400">
                        Status
                    </label>
                    <div className="mt-1">
                        <select
                            id="status"
                            className="block w-full rounded-md border-zinc-700 bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            {...register('status')}
                        >
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-zinc-400">
                        Address
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="address"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.address ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('address', { required: 'Address is required' })}
                        />
                        {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="imagesStr" className="block text-sm font-medium text-zinc-400">
                        Image URLs (One per line)
                        <span className="block text-xs text-zinc-500 mt-1">The first image will be used as the cover.</span>
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="imagesStr"
                            rows={5}
                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.imagesStr ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('imagesStr', { required: 'At least one image URL is required' })}
                        />
                        {errors.imagesStr && <span className="text-xs text-red-500">{errors.imagesStr.message}</span>}
                    </div>
                    {/* Preview Grid */}
                    {imagesPreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagesPreview.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 group">
                                    <img src={img} alt={`Preview ${idx}`} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+URL')} />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center text-xs text-white">
                                        {idx === 0 ? 'Cover' : `Image ${idx + 1}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-400">
                        Description
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="description"
                            rows={4}
                            className="block w-full rounded-md border-zinc-700 bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            {...register('description')}
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-zinc-400">
                        Price / Month
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="price"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.price ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('price', { required: 'Price is required', min: 0 })}
                        />
                        {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-zinc-400">
                        Bedrooms
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="bedrooms"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.bedrooms ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('bedrooms', { required: 'Bedrooms is required', min: 0 })}
                        />
                        {errors.bedrooms && <span className="text-xs text-red-500">{errors.bedrooms.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-zinc-400">
                        Bathrooms
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="bathrooms"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.bathrooms ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('bathrooms', { required: 'Bathrooms is required', min: 0 })}
                        />
                        {errors.bathrooms && <span className="text-xs text-red-500">{errors.bathrooms.message}</span>}
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="sqft" className="block text-sm font-medium text-zinc-400">
                        Square Feet
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="sqft"
                            className={`block w-full rounded-md bg-black/50 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.sqft ? 'border-red-500' : 'border-zinc-700'}`}
                            {...register('sqft', { required: 'Square Feet is required', min: 0 })}
                        />
                        {errors.sqft && <span className="text-xs text-red-500">{errors.sqft.message}</span>}
                    </div>
                </div>
            </div>

            <div className="pt-5 border-t border-zinc-800 flex justify-end gap-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-full border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-indigo-500/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Property'}
                </button>
            </div>
        </form>
    )
}
