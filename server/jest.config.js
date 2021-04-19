module.exports = {
	preset: 'ts-jest',
	collectCoverage: true,
	collectCoverageFrom: ['src/resolvers/**/*.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	verbose: true,
	reporters: ['jest-progress-bar-reporter'],
};
