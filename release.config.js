module.exports = {
    branches: [
        {
            name: 'master',
            channel: false,
        },
    ],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/github',
    ],
};
