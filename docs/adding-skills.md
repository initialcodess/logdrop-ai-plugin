# Adding shared skills

The shared skills are listed in the root README. The MCP server supplies the main LogDrop usage instructions; skills add focused decision paths and task-specific evidence checks. Add another skill only when it provides a useful workflow beyond those instructions and has a distinct selection trigger.

Place each shared skill at `skills/<skill-name>/SKILL.md` with a name and description in YAML frontmatter. Keep references and optional scripts inside the skill directory. Use the platform's skill authoring guidance before adding executable scripts or platform-specific behavior.

Skills in this location can be shared by the four clients. The packaging script includes `skills/` when it exists. Do not copy the full MCP tool catalog or maintain a static scope list here. Resolve tools through the connected server so the workflow follows the live permissions and available features.

Keep instructions in English, use public documentation, and distinguish observed data from a proposed cause. Reuse the server's panel review links for actions that require review. A skill does not grant new permissions or override server validation.

Keep each skill usable on its own. Put conditional detail in references inside that skill and link it from `SKILL.md`; do not make the model read every skill or reference to complete a focused task. Short OpenAI UI metadata can live in `agents/openai.yaml` without changing the shared workflow.

When changing a workflow, check the current MCP descriptions/parameters and the applicable official feature guide. Test the relevant cases in [skill-review.md](skill-review.md). Check names, YAML frontmatter, packaged references, and links as well as behavioral outcomes. Static validation does not prove that a model will follow the skill.
