import { error } from '@sveltejs/kit'
import userImg from '$lib/images/user.png'
import type {
	ImageFieldset,
	ImageFieldsetList,
} from '$lib/components/EditNote/types'
import type { ImageMap } from '$lib/types'

export function getUserImgSrc(imageId?: string | null) {
	return imageId ? `/api/resources/user-images/${imageId}` : userImg
}

export function getNoteImgSrc(imageId: string) {
	return `/api/resources/note-images/${imageId}`
}

export function debounce<
	Callback extends (...args: Parameters<Callback>) => void,
>(fn: Callback, delay: number) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}

export function invariantResponse(
	condition: any,
	message: string | (() => string),
	status: number = 400,
): asserts condition {
	if (!condition) {
		error(status, typeof message === 'function' ? message() : message)
	}
}

/* 
	~~ Copied from https://github.com/epicweb-dev/invariant 
		 which explains better ~~
	This may look useless, but it's a simple declarative way to determine what the 
	type of something is, and to let TypeScript know it. You don't need to reach 
	for a parsing library when doing simple type checks for things that are very
	unlikely to happen, but in these situations we also don't want to just ignore
	TS, cause TS is the annoying best friend who only wants what's best for us
*/
export function invariant(
	condition: any,
	message: string | (() => string),
): asserts condition {
	if (!condition) {
		throw new InvariantError(
			typeof message === 'function' ? message() : message,
		)
	}
}

export function safeRedirect(redirectTo: string | null, defaultPath = '/') {
	if (
		redirectTo &&
		redirectTo.startsWith('/') &&
		!redirectTo.startsWith('//')
	) {
		return redirectTo
	}
	return defaultPath
}

/*
	This function helps construct an enviro-agnostic URL. It also ensures https 
	unless we're on local and is flexible with proxies + load balancers
*/
export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}

class InvariantError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InvariantError'
		Object.setPrototypeOf(this, InvariantError.prototype)
	}
}

const nameRgx = new RegExp(/(\p{L}{1})\p{L}+/u, 'gu')
export function getUserInitials(name: string) {
	const initials = [...name.matchAll(nameRgx)] || []

	return (
		(initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
	).toUpperCase()
}

export function extractImageGroup(formData: FormData) {
	const imageMap = new Map<any, ImageMap>()
	Array.from(formData.entries())
		.filter(([key, _]) => key.includes('images'))
		.forEach(([key, value]) => {
			const [currKey, field] = key.split('.')
			const match = currKey.match(/\[(\d+)\]/)
			const index = match ? match[1] : null
			const image = imageMap.get(currKey)
			image
				? imageMap.set(currKey, { ...image, [field]: value, index })
				: imageMap.set(currKey, { [field]: value, index })
		})
	return Array.from(imageMap.values())
}

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
	return image.id != null
}

export async function transformImageData(images: ImageFieldsetList = []) {
	const imageUpdates = {
		imageUpdates: await Promise.all(
			images.filter(imageHasId).map(async i => {
				if (imageHasFile(i)) {
					return {
						id: i.id,
						altText: i.altText,
						contentType: i.file.type,
						blob: Buffer.from(await i.file.arrayBuffer()),
					}
				} else {
					return {
						id: i.id,
						altText: i.altText,
					}
				}
			}),
		),
		newImages: await Promise.all(
			images
				.filter(imageHasFile)
				.filter(i => !i.id)
				.map(async image => {
					return {
						altText: image.altText,
						contentType: image.file.type,
						blob: Buffer.from(await image.file.arrayBuffer()),
					}
				}),
		),
	}
	return imageUpdates
}

// That way I can target them for removal?
export function initialiseImageList(
	images: Array<{
		id: string
		altText: string | null
	}> | null,
) {
	return images
		? images
		: [{ id: undefined, file: undefined, altText: undefined }]
}
