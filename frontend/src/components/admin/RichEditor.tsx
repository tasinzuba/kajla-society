"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichEditor({ value, onChange, placeholder }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-secondary underline" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing your article...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-kajla focus:outline-none min-h-[400px] px-4 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const form = new FormData();
      form.append("file", file);
      const token = getToken();

      try {
        const res = await fetch(`${API_URL}/uploads`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form,
        });
        const body = await res.json();
        if (!res.ok || !body.success) {
          throw new Error(body.message ?? "Upload failed");
        }
        const url = body.data.url.startsWith("http")
          ? body.data.url
          : `${API_URL.replace(/\/api$/, "")}${body.data.url}`;
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        alert(`Image upload failed: ${err instanceof Error ? err.message : err}`);
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="border border-border rounded-lg p-4 text-sm text-muted">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 px-2 py-2 border-b border-border bg-cream">
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strike"
        >
          <s>S</s>
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          {"</>"}
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          editor={editor}
          onClick={() => {
            const url = window.prompt("Enter URL");
            if (!url) return;
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          title="Add link"
        >
          🔗
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => fileInputRef.current?.click()}
          title="Insert image"
        >
          🖼
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          ↷
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  editor: Editor;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1 text-sm rounded transition ${
        active
          ? "bg-primary text-white"
          : "text-foreground hover:bg-accent/40"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px bg-border mx-1 my-1" />;
}
