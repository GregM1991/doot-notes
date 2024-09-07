import path from 'path'
import { fileURLToPath } from 'url'
import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
})

function legacyPlugin(name, alias = name) {
	const plugin = compat.plugins(name)[0]?.plugins?.[alias]

	if (!plugin) {
		throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`)
	}

	return fixupPluginRules(plugin)
}

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	...compat.extends('plugin:import/typescript'),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				parser: ts.parser,
			},
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},
		plugins: {
			import: legacyPlugin('eslint-plugin-import', 'import'),
		},
		rules: {
			'import/order': [
				'warn',
				{
					alphabetize: { order: 'asc', caseInsensitive: true },
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
				},
			],
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		ignores: [
			'.DS_Store',
			'node_modules',
			'build',
			'.svelte-kit',
			'package',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'static/mockServiceWorker.js',
		],
	},
]

// import js from '@eslint/js'
// import ts from 'typescript-eslint'
// import svelte from 'eslint-plugin-svelte'
// import prettier from 'eslint-config-prettier'
// import globals from 'globals'

// /** @type {import('eslint').Linter.Config[]} */
// export default [
// 	js.configs.recommended,
// 	...ts.configs.recommended,
// 	...svelte.configs['flat/recommended'],
// 	prettier,
// 	...svelte.configs['flat/prettier'],
// 	{
// 		languageOptions: {
// 			globals: {
// 				...globals.browser,
// 				...globals.node,
// 			},
// 		},
// 	},
// 	{
// 		files: ['**/*.svelte'],
// 		languageOptions: {
// 			parserOptions: {
// 				parser: ts.parser,
// 			},
// 		},
// 	},
// 	{
// 		ignores: [
// 			'.DS_Store',
// 			'node_modules',
// 			'build',
// 			'.svelte-kit',
// 			'package',
// 			'.env',
// 			'.env.*',
// 			'!.env.example',
// 			'pnpm-lock.yaml',
// 			'package-lock.json',
// 			'yarn.lock',
// 			'static/mockServiceWorker.js',
// 		],
// 	},
// ]
