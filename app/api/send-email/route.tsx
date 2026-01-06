import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import TourRequestEmail from '@/components/emails/TourRequestEmail';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, date, propertyTitle } = body;

        // Basic validation
        if (!name || !email || !date || !propertyTitle) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            return NextResponse.json(
                { error: 'ADMIN_EMAIL environment variable is not configured' },
                { status: 500 }
            );
        }

        const emailHtml = await render(<TourRequestEmail name={name} email={email} phone={phone} date={date} propertyTitle={propertyTitle} />);

        const data = await resend.emails.send({
            from: 'LuxeLiving <onboarding@resend.dev>', // Default testing domain
            to: [adminEmail], // Configurable recipient
            subject: `Tour Request: ${propertyTitle}`,
            html: emailHtml,
        });

        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Email sending failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
