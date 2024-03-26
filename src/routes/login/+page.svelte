<script lang="ts">
	import { enhance } from "$app/forms"
	import { Button, Input } from "$lib/components"
	import type { ActionData } from "./$types"

  export let actionData: ActionData

</script>

<form method="POST" use:enhance>
  <h1>Hello again!</h1>
  <div class="field-group">
    <Input  label="Enter username" id="username" name="username" value={actionData?.data.formData.username ?? ''}/>
  </div>
  <div class="field-group">
    <Input label="Enter password" id="password" name="password" type="password"/>
  </div>
  <div>
    <label for="remember">Remember me</label>
    <input name="remember" id="remember" type="checkbox" />
  </div>
  <Button fluid type="submit" secondary>Submit</Button>
</form>

<style>
  form {
    display: flex;
    gap: var(--space-s);
    flex-direction: column;
    align-items: center;
    height: 100%;
    max-width: fit-content;
    margin: 0 auto;
    padding-top: var(--space-3xl)
  }

  h1 {
    font-size: var(--type-step-5);
    color: var(--palette-pop)
  }

  @media(max-width: 560px) {
    h1 {
      font-size: var(--type-step-6)
    }
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-3xs);
    width: 100%;
  }
</style>