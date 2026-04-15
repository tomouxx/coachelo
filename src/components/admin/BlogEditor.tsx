"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Italic, Heading2, List, Link as LinkIcon, Image as ImageIcon, Quote } from "lucide-react";

export default function BlogEditor({
  content,
  onChange
}: {
  content: string;
  onChange: (v: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-editorial max-w-none min-h-[400px] p-4 focus:outline-none"
      }
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  const btn = "p-2 rounded hover:bg-brand-nude/40 text-brand-dark";
  const active = "bg-brand-nude text-brand-terracotta";

  return (
    <div className="border border-brand-divider rounded-lg bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-divider p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${editor.isActive("bold") ? active : ""}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} ${editor.isActive("italic") ? active : ""}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL du lien");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          className={btn}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("URL de l'image");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className={btn}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
