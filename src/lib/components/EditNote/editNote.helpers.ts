export const generateCopy = (formId: string | undefined, title: string) => ({
	header: formId ? `Edit ${title}` : 'Doot a new note 📯',
	buttonText: formId ? 'Save changes' : 'Create note',
})
