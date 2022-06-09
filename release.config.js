module.exports = {
    branches: [
        {
            name: 'master',
            channel: false,
        },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular',
                releaseRules: [
                    { type: 'docs', scope: 'readme', release: 'patch' },
                    { type: 'chore', scope: 'deps', release: 'patch' },
                    { type: 'chore', scope: 'docker', release: 'patch' },
                ],
            },
        ],
        '@semantic-release/release-notes-generator',
        '@semantic-release/github',
    ],
};
