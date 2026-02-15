import React from 'react';

const PlaceholderPage = ({ title, icon }) => (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">Coming soon with AI-powered recommendations.</p>
    </div>
);

export const Hotels = () => <PlaceholderPage title="Premium Hotels" icon="🏨" />;
export const Cabs = () => <PlaceholderPage title="City Cabs" icon="🚕" />;
