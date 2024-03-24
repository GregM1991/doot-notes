<script lang="ts">
	import { Button, Input } from "$lib/components"

</script>
<form>
  <h1>Hello again!</h1>
  <div class="field-group">
    <Input label="Enter username" id="username" name="username" />
  </div>
  <div class="field-group">
    <Input label="Enter password" id="password" name="password" type="password"/>
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