import React from 'react';

function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404 - Page Not Found</h1>
            <p style={{ fontSize: '18px', color: '#666' }}>
                We’re sorry, but the page you’re looking for either doesn’t exist, or the requested data cannot be retrieved due to exceeding the daily API request limit.
            </p>
        </div>
    );
}

export default NotFound;
