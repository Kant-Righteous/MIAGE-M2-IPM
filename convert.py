from pathlib import Path

from markitdown import MarkItDown


# ============================================================
# 只需要改这里
# ============================================================

COURSE = "developpement-front"


# ============================================================
# 下面不用修改
# ============================================================

ROOT = Path(__file__).resolve().parent

INPUT_DIR = ROOT / COURSE / "original"
OUTPUT_DIR = ROOT / COURSE / "markdown"


# 常见的学校资料格式
SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".pptx",
    ".docx",
    ".xlsx",
    ".xls",
    ".html",
    ".csv",
    ".json",
    ".xml",
    ".txt",
}


def main() -> None:
    if not INPUT_DIR.is_dir():
        raise SystemExit(
            f"\n输入目录不存在：\n{INPUT_DIR}\n"
        )

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    converter = MarkItDown(
        enable_plugins=False,
    )

    files = sorted(
        path
        for path in INPUT_DIR.rglob("*")
        if path.is_file()
        and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    if not files:
        raise SystemExit(
            f"\n没有找到可以转换的文件：\n{INPUT_DIR}\n"
        )

    print()
    print("=" * 60)
    print(f"Course : {COURSE}")
    print(f"Input  : {INPUT_DIR}")
    print(f"Output : {OUTPUT_DIR}")
    print(f"Files  : {len(files)}")
    print("=" * 60)
    print()

    success_count = 0
    failed_files = []

    # 防止例如 cours.pdf 和 cours.pptx 都被写成 cours.md
    used_output_paths = set()

    for source_file in files:
        relative_path = source_file.relative_to(INPUT_DIR)

        output_file = (
            OUTPUT_DIR
            / relative_path.with_suffix(".md")
        )

        if output_file in used_output_paths:
            extension = source_file.suffix.lstrip(".").lower()

            output_file = output_file.with_name(
                f"{source_file.stem}_{extension}.md"
            )

        used_output_paths.add(output_file)

        output_file.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        print(f"[转换] {relative_path}")

        try:
            result = converter.convert_local(
                str(source_file)
            )

            content = result.text_content

            if not content or not content.strip():
                raise ValueError(
                    "转换结果为空"
                )

            output_file.write_text(
                content,
                encoding="utf-8",
            )

            print(f"       -> {output_file.relative_to(ROOT)}")

            success_count += 1

        except Exception as error:
            print(f"[失败] {relative_path}")
            print(f"       {error}")

            failed_files.append(
                (relative_path, error)
            )

        print()

    print("=" * 60)
    print("转换结束")
    print(f"成功：{success_count}")
    print(f"失败：{len(failed_files)}")
    print("=" * 60)

    if failed_files:
        print("\n失败文件：")

        for path, error in failed_files:
            print(f"- {path}")
            print(f"  {error}")

        raise SystemExit(1)


if __name__ == "__main__":
    main()