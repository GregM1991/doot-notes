import { HONEYPOT_SECRET } from '$env/static/private'
import { Honeypot, SpamError } from '$lib/server/honeypot'
import type { Message } from '$lib/types'
import { setError, type SuperValidated } from 'sveltekit-superforms'
import type { ZodType, z } from 'zod'

export const honeypot = new Honeypot({
	validFromFieldName: null,
	// validFromFieldName: process.env.TESTING ? null : undefined, TODO: Find out why this is done this way
	encryptionSeed: HONEYPOT_SECRET,
})

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
