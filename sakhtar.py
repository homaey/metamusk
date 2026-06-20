# project_snapshot.py
from pathlib import Path
from datetime import datetime
import os

ROOT = Path.cwd()

OUTPUT_FILE = ROOT / "project_snapshot.md"

IGNORE_DIRS = {
    ".git", ".idea", ".vscode",
    "node_modules", "vendor",
    "venv", ".venv", "__pycache__",
    "dist", "build", "coverage",
    ".next", ".nuxt", ".cache",
    "target", "bin", "obj",
}

IGNORE_FILES = {
    ".env", ".env.local", ".env.production", ".env.development",
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "composer.lock", "Pipfile.lock", "poetry.lock",
}

IMPORTANT_FILES = {
    "package.json",
    "tsconfig.json",
    "vite.config.js",
    "vite.config.ts",
    "next.config.js",
    "next.config.ts",
    "nuxt.config.js",
    "nuxt.config.ts",
    "requirements.txt",
    "pyproject.toml",
    "Pipfile",
    "composer.json",
    "docker-compose.yml",
    "Dockerfile",
    "README.md",
    "README.txt",
    "manage.py",
    "app.py",
    "main.py",
    "settings.py",
    "urls.py",
    "routes.py",
    "server.js",
    "index.js",
    "index.ts",
    "main.js",
    "main.ts",
}

CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx",
    ".php", ".java", ".cs", ".go", ".rs",
    ".html", ".css", ".scss",
    ".vue", ".svelte",
    ".json", ".yml", ".yaml", ".toml",
}

MAX_FILE_CHARS = 12000


def should_ignore(path: Path) -> bool:
    parts = set(path.parts)
    if parts & IGNORE_DIRS:
        return True
    if path.name in IGNORE_FILES:
        return True
    if path.name.startswith(".env"):
        return True
    return False


def safe_read(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"[Cannot read file: {e}]"

    if len(text) > MAX_FILE_CHARS:
        return text[:MAX_FILE_CHARS] + "\n\n...[truncated]..."
    return text


def make_tree(root: Path) -> str:
    lines = []

    def walk(directory: Path, prefix: str = ""):
        items = sorted(
            [p for p in directory.iterdir() if not should_ignore(p)],
            key=lambda p: (p.is_file(), p.name.lower())
        )

        for index, path in enumerate(items):
            connector = "└── " if index == len(items) - 1 else "├── "
            lines.append(prefix + connector + path.name)

            if path.is_dir():
                extension = "    " if index == len(items) - 1 else "│   "
                walk(path, prefix + extension)

    lines.append(root.name + "/")
    walk(root)
    return "\n".join(lines)


def collect_stats(root: Path):
    files = []
    ext_count = {}

    for path in root.rglob("*"):
        if path.is_file() and not should_ignore(path):
            files.append(path)
            ext = path.suffix.lower() or "[no extension]"
            ext_count[ext] = ext_count.get(ext, 0) + 1

    return files, ext_count


def main():
    files, ext_count = collect_stats(ROOT)

    with OUTPUT_FILE.open("w", encoding="utf-8") as out:
        out.write("# Project Snapshot\n\n")
        out.write(f"- Generated at: {datetime.now().isoformat(timespec='seconds')}\n")
        out.write(f"- Root folder: `{ROOT.name}`\n")
        out.write(f"- Total scanned files: {len(files)}\n\n")

        out.write("## File Types\n\n")
        for ext, count in sorted(ext_count.items(), key=lambda x: x[1], reverse=True):
            out.write(f"- `{ext}`: {count}\n")

        out.write("\n## Project Structure\n\n")
        out.write("```text\n")
        out.write(make_tree(ROOT))
        out.write("\n```\n\n")

        out.write("## Important Files\n\n")
        important_paths = [
            p for p in files
            if p.name in IMPORTANT_FILES or p.suffix.lower() in CODE_EXTENSIONS
        ]

        for path in sorted(important_paths):
            rel = path.relative_to(ROOT)
            out.write(f"\n### `{rel}`\n\n")
            out.write(f"```{path.suffix.lstrip('.') or 'text'}\n")
            out.write(safe_read(path))
            out.write("\n```\n")

    print(f"Done. Created: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()