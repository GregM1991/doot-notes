<script lang="ts">
	import { Button } from '$lib/components'
	import { getUserImgSrc } from '$lib/utils/misc'
	import SuperDebug, { fileProxy, superForm } from 'sveltekit-superforms'
	import type { PageData } from './$types'
	import Pencil from 'virtual:icons/radix-icons/pencil2'
	import Trash from 'virtual:icons/radix-icons/trash'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { PhotoFormSchema } from '$lib/profile/schemas'

	export let data: PageData
	const { form, enhance, errors } = superForm(data.form, {
		validators: zodClient(PhotoFormSchema),
	})

	const file = fileProxy(form, 'photoFile')
	let newImageSrc: string | null = null
	function handleFileChange(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = event => {
				newImageSrc = event.target?.result?.toString() ?? null
			}
			reader.readAsDataURL(file)
		}
	}
	let lastSubmissionIntent = $form.intent ?? 'idle'
	$: console.log($form.intent)
</script>

<SuperDebug data={$form} />
<div class="photo-change-wrapper">
	<div class="avatar-wrapper">
		<img
			class="avatar"
			src={newImageSrc ?? (data.user ? getUserImgSrc(data.user.image?.id) : '')}
			alt="{data.user.name}'s avatar"
		/>
	</div>
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance
	>
		<div class="button-wrapper">
			<input
				id="photo-file"
				accept="image/*"
				class="sr-only"
				required
				tabIndex={$file ? -1 : 0}
				type="file"
				name="photoFile"
				bind:files={$file}
				on:change={handleFileChange}
			/>
			<label
				id="change-button"
				for="photo-file"
				class="label-button {lastSubmissionIntent}"
			>
				<Pencil />Change
			</label>
			<Button
				name="intent"
				value="submit"
				type="submit"
				id="save-photo-button"
			>
				Save Photo
			</Button>
			<Button
				on:click={() => (newImageSrc = null)}
				type="reset"
				id="reset-button"
				danger
			>
				Reset
			</Button>
			{#if data.user?.image?.id}
				<Button
					name="intent"
					value="delete"
					danger><Trash />Delete</Button
				>
			{/if}
		</div>
	</form>
</div>

<style>
	.photo-change-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
	}

	.avatar-wrapper {
		justify-self: center;
		position: relative;
		width: 12rem;
		height: 12rem;
		text-align: center;
		border-radius: 9999px;
	}

	.avatar {
		display: grid;
		place-items: center;
		object-fit: cover;
		width: 100%;
		height: 100%;
		border-radius: 9999px;
	}

	.button-wrapper {
		display: flex;
		gap: var(--space-s);
	}

	/* TODO: Find a way to clean this up (can Button take asChild prop?) */
	.label-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3xs);
		padding: var(--space-xs);
		background: var(--palette-pop);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
		width: var(--width);
		font-size: var(--font-size);
		cursor: pointer;
		color: #fff;

		transition: var(--animation-quick);
	}

	.label-button:hover {
		filter: var(--border-drop-shadow-black-hover);
	}

	.label-button:focus {
		filter: var(--border-drop-shadow-black-hover);
		outline: none;
	}

	.label-button:active {
		filter: var(--border-drop-shadow-black-focus);
	}

	#photo-file:valid + #change-button {
		display: none;
	}

	/* TODO: Is this the best way to do this? */
	:global(#photo-file:invalid ~ #save-photo-button) {
		display: none;
	}

	:global(#photo-file:invalid ~ #reset-button) {
		display: none;
	}
</style>
