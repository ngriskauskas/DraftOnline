module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'src/components/**/*.tsx',
		'src/pages/**/*.tsx',
		'src/utils/**/*.ts',
		'!src/pages/_app.tsx',
	],
	transform: {
		'^.+\\.tsx?$': 'babel-jest',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	resetMocks: true,
};
