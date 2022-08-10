module.exports = {
    async rewrites() {
        return [
            {
                source: '/login',
                destination: '/auth/login',
            },
            {
                source: '/register',
                destination: '/auth/register',
            },
            {
                source: '/reset-password',
                destination: '/auth/reset-password',
            },
            {
                source: '/forgot-password',
                destination: '/auth/forgot-password',
            },
            {
                source: '/:username',
                destination: '/profile/:username',
            },
        ];
    },
}