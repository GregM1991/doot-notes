import { setError, type SuperValidated } from 'sveltekit-superforms'
import { type ZodType, type z } from 'zod'
import { env } from '$env/dynamic/private'
import { Honeypot, SpamError } from '$lib/server/honeypot'
import { type Message } from '$lib/types'

export const honeypot = new Honeypot({
	validFromFieldName: null,
	// validFromFieldName: process.env.TESTING ? null : undefined, TODO: Find out why this is done this way
	encryptionSeed: env.HONEYPOT_SECRET,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkHoneypot<T extends ZodType<any, any>>(
	formData: FormData,
	form: SuperValidated<z.input<T>, Message, z.output<T>>,
) {
	try {
		honeypot.check(formData)
	} catch (error) {
		if (error instanceof SpamError) {
			return setError(form, '', 'Form not submitted properly')
		}
		throw error
	}
}
