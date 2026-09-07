from pathlib import Path
import subprocess
import shutil


# ============================================================
# 只需要改这里，这里是每个科目的文件夹名称
# ============================================================

COURSE = "developpement-front"


# ============================================================
# 下面不用修改
# ============================================================

ROOT = Path(__file__).resolve().parent

INPUT_DIR = ROOT / COURSE / "original"
OUTPUT_DIR = ROOT / COURSE / "markdown"


def main() -> None:
    """
    把当前课程 original/ 文件夹中的资料转换成 Markdown。

    目录结构：

    MIAGE-M2-IPM/
    ├── convert.py
    ├── requirements.txt
    │
    └── developpement-front/
        ├── original/
        │   ├── cours.pdf
        │   ├── slides.pptx
        │   └── exercice.docx
        │
        └── markdown/

    使用：

        python convert.py

    以后换课程，只修改文件顶部：

        COURSE = "base-de-donnees"

    然后再次：

        python convert.py
    """

    # 检查课程目录
    course_dir = ROOT / COURSE

    if not course_dir.is_dir():
        raise SystemExit(
            f"\n课程目录不存在：\n{course_dir}\n"
        )

    # 检查 original 目录
    if not INPUT_DIR.is_dir():
        raise SystemExit(
            f"\n输入目录不存在：\n{INPUT_DIR}\n"
        )

    # 检查 Docling
    if shutil.which("docling") is None:
        raise SystemExit(
            "\n没有找到 Docling。\n"
            "请先运行：\n\n"
            "    pip install -r requirements.txt\n"
        )

    # 自动创建 markdown 目录
    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Docling 命令
    command = [
        "docling",
        "convert",
        str(INPUT_DIR),
        "--to",
        "md",
        "--image-export-mode",
        "referenced",
        "--output",
        str(OUTPUT_DIR),
    ]

    print()
    print("=" * 60)
    print(f"Course : {COURSE}")
    print(f"Input  : {INPUT_DIR}")
    print(f"Output : {OUTPUT_DIR}")
    print("=" * 60)
    print()

    # 开始转换
    try:
        subprocess.run(
            command,
            check=True,
        )

    except subprocess.CalledProcessError as error:
        raise SystemExit(
            f"\n转换失败，Docling exit code: {error.returncode}"
        )

    print()
    print("=" * 60)
    print("转换完成")
    print(f"输出目录：{OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()