'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from '@/lib/navigation'
import { Loader2 } from 'lucide-react'
import { Property } from '@/types'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useDebounce } from 'use-debounce'

interface PropertyFormData extends Omit<Property, 'id' | 'created_at' | 'images'> {
    imagesStr: string
}

export default function AdminPropertyForm({ initialData }: { initialData?: Property }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [geocoding, setGeocoding] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<PropertyFormData>({
        defaultValues: initialData ? {
            ...initialData,
            imagesStr: initialData.images && initialData.images.length > 0
                ? initialData.images.join('\n')
                : initialData.image_url || '',
            lat: initialData.lat || 0,
            lng: initialData.lng || 0,
            amenities: initialData.amenities || [],
            address1: initialData.address1 || '',
            address2: initialData.address2 || '',
            city: initialData.city || '',
            state: initialData.state || '',
            zip: initialData.zip || '',
            address: initialData.address || '' // Ensure address is initialized if present
        } : {
            title: '',
            price: 0,
            address: '', // This will be populated by geocoding or derived
            description: '',
            image_url: '',
            sqft: 0,
            bedrooms: 0,
            bathrooms: 0,
            status: 'available',
            imagesStr: '',
            lat: 0,
            lng: 0,
            amenities: [],
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: ''
        }
    })

    const imagesStr = watch('imagesStr')
    const imagesPreview = imagesStr
        ? imagesStr.split('\n').filter(url => url.trim() !== '')
        : []

    const selectedAmenities = watch('amenities') || []

    // Toggle amenity helper
    const toggleAmenity = (amenity: string) => {
        const current = getValues('amenities') || []
        const updated = current.includes(amenity)
            ? current.filter(a => a !== amenity)
            : [...current, amenity]
        setValue('amenities', updated)
    }

    // Watch split address fields
    const address1 = watch('address1')
    const city = watch('city')
    const state = watch('state')
    const zip = watch('zip')

    // Combine for debounce
    const combinedAddress = `${address1 || ''} ${city || ''} ${state || ''} ${zip || ''}`.trim()
    const [debouncedAddress] = useDebounce(combinedAddress, 1000)

    useEffect(() => {
        register('amenities')
        // Register the 'address' field as it's used in onSubmit but not directly in an input
        register('address')
    }, [register])

    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!debouncedAddress) return

            // Avoid re-fetching if coordinates are already set and matched (heuristic)
            const currentLat = getValues('lat')
            const currentLng = getValues('lng')
            // Only skip if we have coords and the address matches initial (edit mode optimization)
            if (initialData && currentLat !== 0 && currentLng !== 0) {
                const initialCombined = `${initialData.address1 || ''} ${initialData.city || ''} ${initialData.state || ''} ${initialData.zip || ''}`.trim()
                if (initialCombined === debouncedAddress) return;
            }

            setGeocoding(true)
            try {
                // Add addressdetails=1 to get components if needed, though mostly using lat/lon/display_name here
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedAddress)}&addressdetails=1&limit=1`)
                const data = await response.json()

                if (data && data.length > 0) {
                    const result = data[0]
                    setValue('lat', parseFloat(result.lat))
                    setValue('lng', parseFloat(result.lon))

                    // Optional: autofill missing fields from response? 
                    // User explicitly asked for "split fields", implying they want control.
                    // We will NOT overwrite what they typed, but we'll ensure lat/lng is synced.
                    // If we wanted to standardise: we could update fields here.

                    // For legacy support, construct the full address string
                    setValue('address', result.display_name)
                } else {
                    setValue('lat', 0)
                    setValue('lng', 0)
                    setValue('address', '') // Clear address if not found
                }
            } catch (error) {
                console.error('Geocoding error:', error)
                setValue('lat', 0)
                setValue('lng', 0)
                setValue('address', '')
            } finally {
                setGeocoding(false)
            }
        }

        fetchCoordinates()
    }, [debouncedAddress, setValue, getValues, initialData])

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
                // Ensure legacy address is populated if geocoding didn't fill it yet
                address: data.address || `${data.address1}, ${data.city}, ${data.state} ${data.zip}`,
                description: data.description,
                image_url: mainImage,
                images: images,
                sqft: Number(data.sqft),
                bedrooms: Number(data.bedrooms),
                bathrooms: Number(data.bathrooms),
                status: data.status,
                lat: Number(data.lat),
                lng: Number(data.lng),
                amenities: data.amenities,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                state: data.state,
                zip: data.zip
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Property Title
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="title"
                            className={`block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.title ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Status
                    </label>
                    <div className="mt-1">
                        <select
                            id="status"
                            className="block w-full rounded-md border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            {...register('status')}
                        >
                            <option value="available">Available</option>
                            <option value="rented">Rented</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                {/* Split Address Fields */}
                <div className="sm:col-span-6">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Location Details</h3>
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label htmlFor="address1" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Address Line 1</label>
                            <input
                                type="text"
                                id="address1"
                                placeholder="123 Main St"
                                className={`mt-1 block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.address1 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                                {...register('address1', { required: 'Address Line 1 is required' })}
                            />
                            {errors.address1 && <span className="text-xs text-red-500">{errors.address1.message}</span>}
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="address2" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Address Line 2 (Optional)</label>
                            <input
                                type="text"
                                id="address2"
                                placeholder="Apt 4B"
                                className="mt-1 block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border-zinc-200 dark:border-zinc-700"
                                {...register('address2')}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="city" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">City</label>
                            <input
                                type="text"
                                id="city"
                                className={`mt-1 block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                                {...register('city', { required: 'City is required' })}
                            />
                            {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="state" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">State</label>
                            <input
                                type="text"
                                id="state"
                                className={`mt-1 block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.state ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                                {...register('state', { required: 'State is required' })}
                            />
                            {errors.state && <span className="text-xs text-red-500">{errors.state.message}</span>}
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="zip" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">Zip / Postal Code</label>
                            <input
                                type="text"
                                id="zip"
                                className={`mt-1 block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.zip ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                                {...register('zip', { required: 'Zip code is required' })}
                            />
                            {errors.zip && <span className="text-xs text-red-500">{errors.zip.message}</span>}
                        </div>

                        {geocoding && <span className="text-xs text-indigo-500 sm:col-span-6 animate-pulse">Locating...</span>}
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="imagesStr" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Image URLs (One per line)
                        <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-1">The first image will be used as the cover.</span>
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="imagesStr"
                            rows={5}
                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                            className={`block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.imagesStr ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                            {...register('imagesStr', { required: 'At least one image URL is required' })}
                        />
                        {errors.imagesStr && <span className="text-xs text-red-500">{errors.imagesStr.message}</span>}
                    </div>
                    {/* Preview Grid */}
                    {imagesPreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagesPreview.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
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
                    <label htmlFor="description" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Description
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="description"
                            rows={4}
                            className="block w-full rounded-md border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
                            {...register('description')}
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Price / Month
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="price"
                            className={`block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.price ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                            {...register('price', { required: 'Price is required', min: 0 })}
                        />
                        {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Bedrooms
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="bedrooms"
                            className={`block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.bedrooms ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                            {...register('bedrooms', { required: 'Bedrooms is required', min: 0 })}
                        />
                        {errors.bedrooms && <span className="text-xs text-red-500">{errors.bedrooms.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Bathrooms
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="bathrooms"
                            className={`block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.bathrooms ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                            {...register('bathrooms', { required: 'Bathrooms is required', min: 0 })}
                        />
                        {errors.bathrooms && <span className="text-xs text-red-500">{errors.bathrooms.message}</span>}
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="sqft" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Square Feet
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            id="sqft"
                            className={`block w-full rounded-md bg-zinc-50 dark:bg-black/50 text-text-primary shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 ${errors.sqft ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                            {...register('sqft', { required: 'Square Feet is required', min: 0 })}
                        />
                        {errors.sqft && <span className="text-xs text-red-500">{errors.sqft.message}</span>}
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Amenities
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {['Pool', 'Gym', 'WiFi', 'Parking', 'Concierge', 'Rooftop', 'Spa', 'Garden', 'Beach Access'].map((amenity) => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedAmenities.includes(amenity)
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 ring-1 ring-indigo-500/50'
                                    : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500/50'
                                    }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sm:col-span-6 border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-2 hidden">
                    <input type="hidden" {...register('lat', { valueAsNumber: true })} />
                    <input type="hidden" {...register('lng', { valueAsNumber: true })} />
                </div>

            </div>

            <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        </form >
    )
}
