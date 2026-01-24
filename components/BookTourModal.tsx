'use client'

import { useState } from 'react'
import { X, Calendar, Check } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useTranslations } from 'next-intl'

interface BookTourModalProps {
    isOpen: boolean
    onClose: () => void
    propertyTitle: string
    propertyId: string
}

interface TourRequestFormInputs {
    name: string
    email: string
    phone: string
    date: string
}

export default function BookTourModal({ isOpen, onClose, propertyTitle, propertyId }: BookTourModalProps) {
    const t = useTranslations('BookTour')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TourRequestFormInputs>()

    if (!isOpen) return null

    const onSubmit: SubmitHandler<TourRequestFormInputs> = async (data) => {
        setIsSubmitting(true)

        const payload = {
            ...data,
            propertyTitle
        }

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error('Failed to send email')
            }

            // Track inquiry
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    property_id: propertyId,
                    event_type: 'inquiry',
                    metadata: { source: 'book_tour_modal' }
                })
            }).catch(e => console.error('Failed to track inquiry', e))

            setIsSubmitting(false)
            setIsSuccess(true)
            reset()

            // Close after success message
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
            }, 3000)
        } catch (error) {
            console.error('Error sending tour request:', error)
            alert('Failed to send request. Please try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-bg-card dark:bg-zinc-900 border border-border-color dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-zinc-800">
                    <h3 className="text-xl font-bold text-text-primary dark:text-white">{t('title')}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted dark:text-zinc-400 hover:text-text-primary dark:hover:text-white rounded-full hover:bg-bg-secondary dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                                <Check className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-text-primary dark:text-white">{t('successTitle')}</h4>
                            <p className="text-text-muted dark:text-zinc-400">
                                {t.rich('successMessage', {
                                    property: propertyTitle,
                                    strong: (chunks) => <strong>{chunks}</strong>
                                })}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <p className="text-sm text-text-muted dark:text-zinc-400 mb-4">
                                {t('subtitle')} <span className="text-indigo-500 dark:text-indigo-400 font-medium">{propertyTitle}</span>.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-medium text-text-muted dark:text-zinc-500 uppercase">{t('fields.name')}</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className={`w-full bg-bg-input dark:bg-black/50 border rounded-lg px-4 py-3 text-text-primary dark:text-white focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-border-color dark:border-zinc-800 focus:border-indigo-500'}`}
                                        {...register('name', { required: t('fields.nameRequired') })}
                                    />
                                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-xs font-medium text-text-muted dark:text-zinc-500 uppercase">{t('fields.phone')}</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="(555) 000-0000"
                                        className={`w-full bg-bg-input dark:bg-black/50 border rounded-lg px-4 py-3 text-text-primary dark:text-white focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border-color dark:border-zinc-800 focus:border-indigo-500'}`}
                                        {...register('phone', {
                                            required: t('fields.phoneRequired'),
                                            pattern: {
                                                value: /^[\d\+\-\(\) ]+$/,
                                                message: t('fields.phoneInvalid')
                                            }
                                        })}
                                    />
                                    {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs font-medium text-text-muted dark:text-zinc-500 uppercase">{t('fields.email')}</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`w-full bg-bg-input dark:bg-black/50 border rounded-lg px-4 py-3 text-text-primary dark:text-white focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-border-color dark:border-zinc-800 focus:border-indigo-500'}`}
                                    {...register('email', {
                                        required: t('fields.emailRequired'),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t('fields.emailInvalid')
                                        }
                                    })}
                                />
                                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="date" className="text-xs font-medium text-text-muted dark:text-zinc-500 uppercase">{t('fields.date')}</label>
                                <div className="relative">
                                    <input
                                        id="date"
                                        type="date"
                                        className={`w-full bg-bg-input dark:bg-black/50 border rounded-lg px-4 py-3 text-text-primary dark:text-white focus:outline-none transition-colors dark:[&::-webkit-calendar-picker-indicator]:invert ${errors.date ? 'border-red-500 focus:border-red-500' : 'border-border-color dark:border-zinc-800 focus:border-indigo-500'}`}
                                        {...register('date', {
                                            required: t('fields.dateRequired'),
                                            validate: (value) => {
                                                const selectedDate = new Date(value)
                                                const today = new Date()
                                                today.setHours(0, 0, 0, 0)
                                                return selectedDate >= today || t('fields.datePast')
                                            }
                                        })}
                                    />
                                </div>
                                {errors.date && <span className="text-xs text-red-500">{errors.date.message}</span>}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Calendar className="w-5 h-5" />
                                            {t('submit')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
