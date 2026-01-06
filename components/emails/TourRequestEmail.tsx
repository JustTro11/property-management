import * as React from 'react';

interface TourRequestEmailProps {
    name: string;
    email: string;
    phone: string;
    date: string;
    propertyTitle: string;
}

export const TourRequestEmail: React.FC<TourRequestEmailProps> = ({
    name,
    email,
    phone,
    date,
    propertyTitle,
}) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.5, color: '#333' }}>
        <h2 style={{ color: '#4f46e5' }}>New Tour Request</h2>
        <p>You have received a new tour request for <strong>{propertyTitle}</strong>.</p>

        <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <p style={{ margin: '5px 0' }}><strong>Name:</strong> {name}</p>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {email}</p>
            <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {phone}</p>
            <p style={{ margin: '5px 0' }}><strong>Preferred Date:</strong> {date}</p>
        </div>

        <p style={{ fontSize: '14px', color: '#666' }}>
            This email was sent from your LuxeLiving website.
        </p>
    </div>
);

export default TourRequestEmail;
