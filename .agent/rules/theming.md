---
trigger: always_on
---

---
trigger: always_on
---

# Theming (Light/Dark Mode)

- **Always Support Both Modes**: When adding or modifying styles, you MUST ensure they work correctly in both light and dark modes.
- **Use `dark:` Variants**: Use Tailwind's `dark:` prefix for dark mode styles (e.g., `bg-white dark:bg-zinc-900`).
- **Semantic Colors**: Prefer semantic CSS variable-based classes (`bg-bg-primary`, `text-text-primary`) when available.
- **Default is Dark**: Dark mode is the default theme. New users see dark mode unless they explicitly switch to light.
- **Test Both Modes**: Always verify styling changes look correct in both modes before completing a task.