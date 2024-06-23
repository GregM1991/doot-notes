import { render, screen } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'
import ImageEditor from './ImageEditor.svelte'
import testImage from './test-img.jpg'
import * as misc from '$lib/utils/misc'

describe('ImageEditor', () => {
	const fileBlob = new Blob([testImage], { type: 'image/jpeg' })
	const defaultImage = {
		id: 'test-id',
		altText: 'Test Alt Text',
		file: new File([fileBlob], 'testImage.jpg', { type: 'image/jpeg' }),
	}
	test('If an image is passed, then a preview image is shown', () => {
		const spy = vi.spyOn(misc, 'getNoteImgSrc')
		render(ImageEditor, { image: defaultImage, index: 0 })
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith(defaultImage.id)
	})
})
