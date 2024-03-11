<nav>
  <a href="/" class="logo">
    <span class="line top"> Doot</span>
    <span class="line bottom">Notes</span>
  </a>
  <a href="/users" class="nav-link">Users</a>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .logo {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		font-size: var(--type-step-0);
		color: var(--palette-primary);
		font-weight: var(--type-weight-bold);
	}

	.line {
		display: flex;
		position: relative;
		align-items: center;
	}

	.line.top::before {
		content: '📯';
		position: absolute;
		left: -35px;
	}

	.line.bottom::after {
		content: '📯';
		position: absolute;
		right: -30px;
	}
</style>