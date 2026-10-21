"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ImageExtension from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { normalizeRichContent } from "@/lib/richText";

/* ========================================================================= */
/* MONOCHROME EDITORIAL SVG MICRO-ICONS (1.75px STROKE)                      */
/* ========================================================================= */
function Icon({ name, className = "w-3.5 h-3.5" }) {
  switch (name) {
    case "undo":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
      );
    case "redo":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
        </svg>
      );
    case "bold":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6v-8z" />
        </svg>
      );
    case "italic":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h6m-4 16h6M14 4l-4 16" />
        </svg>
      );
    case "underline":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 4v7a6 6 0 0012 0V4M4 20h16" />
        </svg>
      );
    case "strike":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M16 6a4 4 0 00-7-2c-2.2 0-3 1.5-3 3 0 3 4 3.5 4 5s-2 2-3 2c-1.5 0-3-.8-3.5-2M15 14c1 1.5 1 3 0 4-1 1-2.5 1.5-4 1.5-2 0-3.5-.8-4-2" />
        </svg>
      );
    case "align-left":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
        </svg>
      );
    case "align-center":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M5 18h14" />
        </svg>
      );
    case "align-right":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 12h10M6 18h14" />
        </svg>
      );
    case "align-justify":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case "bullet-list":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "ordered-list":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 6h14M7 12h14M7 18h14M3 5v3m0 0h1m-1 0H2m1 4v3h2m-2 3h2v3H3" />
        </svg>
      );
    case "quote":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12H4a2 2 0 01-2-2V6a2 2 0 012-2h4v8zm0 0v6a4 4 0 01-4 4M20 12h-4a2 2 0 01-2-2V6a2 2 0 012-2h4v8zm0 0v6a4 4 0 01-4 4" />
        </svg>
      );
    case "hr":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
        </svg>
      );
    case "link":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case "unlink":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
    case "image":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "table":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      );
    case "clear":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case "code":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "upload":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case "check":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    default:
      return null;
  }
}

/* ========================================================================= */
/* MAIN RICH TEXT EDITOR COMPONENT                                           */
/* ========================================================================= */
export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write and format editorial content here...",
  minHeight = "240px",
  className = "",
  disabled = false,
}) {
  const [editorMode, setEditorMode] = useState("visual"); // "visual" | "source"
  const [sourceCode, setSourceCode] = useState(value || "");

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(true);

  // Image Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageTab, setImageTab] = useState("upload"); // "upload" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Table Menu State
  const [tableMenuOpen, setTableMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  // Initialize TipTap
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: "noopener noreferrer",
            target: "_blank",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "cms-embedded-image",
        },
      }),
      TableKit.configure({
        table: {
          resizable: true,
          HTMLAttributes: {
            class: "cms-table",
          },
        },
      }),
    ],
    content: normalizeRichContent(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceCode(html);
      if (onChange) {
        onChange(html);
      }
    },
  });

  // Keep TipTap in sync if external `value` prop changes
  useEffect(() => {
    if (!editor) return;

    const normalized = normalizeRichContent(value);
    const currentHtml = editor.getHTML();

    if (normalized !== currentHtml && !editor.isFocused) {
      editor.commands.setContent(normalized, false);
      setSourceCode(normalized);
    }
  }, [value, editor]);

  // Synchronize source code edits back to TipTap
  const handleSourceChange = (e) => {
    const newHtml = e.target.value;
    setSourceCode(newHtml);
    if (onChange) {
      onChange(newHtml);
    }
  };

  const switchMode = (mode) => {
    if (mode === "visual" && editorMode === "source") {
      // Re-hydrate visual editor with edited source
      const normalized = normalizeRichContent(sourceCode);
      if (editor) {
        editor.commands.setContent(normalized, false);
      }
    } else if (mode === "source" && editorMode === "visual") {
      if (editor) {
        setSourceCode(editor.getHTML());
      }
    }
    setEditorMode(mode);
  };

  // ---------------------------------------------------------------------------
  // LINK ACTIONS
  // ---------------------------------------------------------------------------
  const openLinkModal = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setLinkOpenInNewTab(true);
    setLinkModalOpen(true);
  };

  const handleApplyLink = (e) => {
    e.preventDefault();
    if (!editor) return;

    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkModalOpen(false);
      return;
    }

    let formattedUrl = linkUrl.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:") &&
      !formattedUrl.startsWith("tel:")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: formattedUrl,
        target: linkOpenInNewTab ? "_blank" : undefined,
      })
      .run();

    setLinkModalOpen(false);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setLinkModalOpen(false);
    setLinkUrl("");
  };

  // ---------------------------------------------------------------------------
  // CLOUDINARY IMAGE UPLOADS
  // ---------------------------------------------------------------------------
  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "alokworld_articles");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload image to Cloudinary");
      }

      // Insert image node into TipTap
      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({
            src: data.url,
            alt: imageAlt.trim() || file.name,
            title: imageAlt.trim() || file.name,
          })
          .run();
      }

      setImageModalOpen(false);
      setImageUrl("");
      setImageAlt("");
    } catch (err) {
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInsertUrlImage = (e) => {
    e.preventDefault();
    if (!editor || !imageUrl.trim()) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl.trim(),
        alt: imageAlt.trim(),
        title: imageAlt.trim(),
      })
      .run();

    setImageModalOpen(false);
    setImageUrl("");
    setImageAlt("");
  };

  // ---------------------------------------------------------------------------
  // TABLE ACTIONS
  // ---------------------------------------------------------------------------
  const isInsideTable = editor?.isActive("table") || false;

  return (
    <div
      ref={editorRef}
      className={`border border-[#D5CEC4] rounded-xs bg-white text-[#263449] focus-within:border-[#102F6B] transition-colors ${className}`}
    >
      {/* ===================================================================== */}
      {/* TOP TOOLBAR                                                           */}
      {/* ===================================================================== */}
      <div className="bg-[#FAF8F3] border-b border-[#E2DDD5] px-2 py-1.5 flex flex-wrap items-center justify-between gap-1 select-none text-xs">
        {/* Left Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-0.5">
          {/* History: Undo / Redo */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Undo (Ctrl+Z)"
              disabled={!editor || !editor.can().undo()}
              onClick={() => editor?.chain().focus().undo().run()}
              className="p-1 rounded-xs text-[#263449] hover:bg-[#EAE4D9] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Icon name="undo" />
            </button>
            <button
              type="button"
              title="Redo (Ctrl+Y)"
              disabled={!editor || !editor.can().redo()}
              onClick={() => editor?.chain().focus().redo().run()}
              className="p-1 rounded-xs text-[#263449] hover:bg-[#EAE4D9] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <Icon name="redo" />
            </button>
          </div>

          {/* Heading Selector */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Normal Paragraph"
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={`px-1.5 py-0.5 rounded-xs font-medium text-[11px] ${
                editor?.isActive("paragraph") && !editor?.isActive("heading")
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              P
            </button>
            <button
              type="button"
              title="Heading 1"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-1.5 py-0.5 rounded-xs font-bold text-[11px] ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              H1
            </button>
            <button
              type="button"
              title="Heading 2"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-1.5 py-0.5 rounded-xs font-bold text-[11px] ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              H2
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-1.5 py-0.5 rounded-xs font-bold text-[11px] ${
                editor?.isActive("heading", { level: 3 })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              H3
            </button>
          </div>

          {/* Typography: Bold, Italic, Underline, Strike */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Bold (Ctrl+B)"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("bold") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="bold" />
            </button>
            <button
              type="button"
              title="Italic (Ctrl+I)"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("italic") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="italic" />
            </button>
            <button
              type="button"
              title="Underline (Ctrl+U)"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("underline") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="underline" />
            </button>
            <button
              type="button"
              title="Strikethrough"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("strike") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="strike" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Align Left"
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`p-1 rounded-xs ${
                editor?.isActive({ textAlign: "left" })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="align-left" />
            </button>
            <button
              type="button"
              title="Align Center"
              onClick={() => editor?.chain().focus().setTextAlign("center").run()}
              className={`p-1 rounded-xs ${
                editor?.isActive({ textAlign: "center" })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="align-center" />
            </button>
            <button
              type="button"
              title="Align Right"
              onClick={() => editor?.chain().focus().setTextAlign("right").run()}
              className={`p-1 rounded-xs ${
                editor?.isActive({ textAlign: "right" })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="align-right" />
            </button>
            <button
              type="button"
              title="Justify"
              onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
              className={`p-1 rounded-xs ${
                editor?.isActive({ textAlign: "justify" })
                  ? "bg-[#102F6B] text-white"
                  : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="align-justify" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Bulleted List"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("bulletList") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="bullet-list" />
            </button>
            <button
              type="button"
              title="Numbered List"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("orderedList") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="ordered-list" />
            </button>
          </div>

          {/* Quotes, Divider */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Blockquote"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-1 rounded-xs ${
                editor?.isActive("blockquote") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="quote" />
            </button>
            <button
              type="button"
              title="Horizontal Divider"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="p-1 rounded-xs text-[#263449] hover:bg-[#EAE4D9]"
            >
              <Icon name="hr" />
            </button>
          </div>

          {/* Link */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Insert Link"
              onClick={openLinkModal}
              className={`p-1 rounded-xs ${
                editor?.isActive("link") ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="link" />
            </button>
            {editor?.isActive("link") && (
              <button
                type="button"
                title="Remove Link"
                onClick={handleRemoveLink}
                className="p-1 rounded-xs text-red-700 hover:bg-red-50"
              >
                <Icon name="unlink" />
              </button>
            )}
          </div>

          {/* Image & Media */}
          <div className="flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Insert Image (Cloudinary or URL)"
              onClick={() => setImageModalOpen(true)}
              className="p-1 rounded-xs text-[#263449] hover:bg-[#EAE4D9] flex items-center gap-1"
            >
              <Icon name="image" />
              <span className="text-[10px] font-medium hidden sm:inline">Image</span>
            </button>
          </div>

          {/* Tables */}
          <div className="relative flex items-center border-r border-[#E2DDD5] pr-1 mr-1">
            <button
              type="button"
              title="Table Operations"
              onClick={() => setTableMenuOpen(!tableMenuOpen)}
              className={`p-1 rounded-xs flex items-center gap-1 ${
                isInsideTable ? "bg-[#102F6B] text-white" : "text-[#263449] hover:bg-[#EAE4D9]"
              }`}
            >
              <Icon name="table" />
              <span className="text-[10px] font-medium hidden sm:inline">Table</span>
            </button>

            {/* Table Dropdown Menu */}
            {tableMenuOpen && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-[#E2DDD5] shadow-md rounded-xs z-30 py-1 w-44 text-xs"
                onClick={() => setTableMenuOpen(false)}
              >
                {!isInsideTable ? (
                  <button
                    type="button"
                    onClick={() =>
                      editor
                        ?.chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    }
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FAF8F3] text-[#1E293B]"
                  >
                    Insert Table (3 × 3)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addRowBefore().run()}
                      className="w-full text-left px-3 py-1 hover:bg-[#FAF8F3] text-[#1E293B]"
                    >
                      + Add Row Above
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addRowAfter().run()}
                      className="w-full text-left px-3 py-1 hover:bg-[#FAF8F3] text-[#1E293B]"
                    >
                      + Add Row Below
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteRow().run()}
                      className="w-full text-left px-3 py-1 hover:bg-red-50 text-red-700"
                    >
                      Delete Row
                    </button>
                    <div className="border-t border-[#E2DDD5] my-1" />
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addColumnBefore().run()}
                      className="w-full text-left px-3 py-1 hover:bg-[#FAF8F3] text-[#1E293B]"
                    >
                      + Add Column Left
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addColumnAfter().run()}
                      className="w-full text-left px-3 py-1 hover:bg-[#FAF8F3] text-[#1E293B]"
                    >
                      + Add Column Right
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteColumn().run()}
                      className="w-full text-left px-3 py-1 hover:bg-red-50 text-red-700"
                    >
                      Delete Column
                    </button>
                    <div className="border-t border-[#E2DDD5] my-1" />
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteTable().run()}
                      className="w-full text-left px-3 py-1 hover:bg-red-50 text-red-700 font-semibold"
                    >
                      Delete Whole Table
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            title="Clear Formatting"
            onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1 rounded-xs text-[#64748B] hover:text-[#1E293B] hover:bg-[#EAE4D9]"
          >
            <Icon name="clear" />
          </button>
        </div>

        {/* Right Switcher: Visual vs HTML Source */}
        <div className="flex items-center gap-1 bg-[#EAE4D9] p-0.5 rounded-xs">
          <button
            type="button"
            onClick={() => switchMode("visual")}
            className={`px-2 py-0.5 rounded-xs text-[10px] font-medium transition-colors ${
              editorMode === "visual"
                ? "bg-white text-[#102F6B] shadow-xs font-semibold"
                : "text-[#55657E] hover:text-[#102F6B]"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => switchMode("source")}
            className={`px-2 py-0.5 rounded-xs text-[10px] font-mono transition-colors ${
              editorMode === "source"
                ? "bg-white text-[#102F6B] shadow-xs font-semibold"
                : "text-[#55657E] hover:text-[#102F6B]"
            }`}
          >
            &lt;/&gt; Source
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* EDITING AREA                                                          */}
      {/* ===================================================================== */}
      {editorMode === "visual" ? (
        <div
          className="p-3 sm:p-4 bg-white cursor-text cms-prose focus-within:ring-0"
          style={{ minHeight }}
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      ) : (
        <textarea
          rows={12}
          value={sourceCode}
          onChange={handleSourceChange}
          placeholder="<div>Raw HTML code...</div>"
          style={{ minHeight }}
          className="w-full p-3 font-mono text-xs bg-[#FCFBF8] text-[#1E293B] border-0 outline-hidden resize-y leading-relaxed"
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: INSERT / EDIT LINK                                             */}
      {/* ===================================================================== */}
      {linkModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2DDD5] shadow-xl max-w-sm w-full p-4 rounded-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2">
              <span className="font-bold text-[#102F6B]">Insert / Edit Link</span>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                  Destination URL (Web, mailto: or tel:)
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com or mailto:info@..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#D5CEC4] rounded-xs font-mono text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-[#1E293B]">
                <input
                  type="checkbox"
                  checked={linkOpenInNewTab}
                  onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                />
                <span>Open link in new browser tab</span>
              </label>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD5]">
                {editor?.isActive("link") ? (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    className="text-red-700 hover:underline text-[11px]"
                  >
                    Remove Link
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkModalOpen(false)}
                    className="px-2.5 py-1 border border-[#D5CEC4] text-[#55657E] hover:bg-[#FAF8F3] rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#102F6B] hover:bg-[#0D1B2A] text-white font-medium rounded-xs"
                  >
                    Apply Link
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CLOUDINARY IMAGE INSERTION                                     */}
      {/* ===================================================================== */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2DDD5] shadow-xl max-w-md w-full p-4 rounded-xs text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2">
              <span className="font-bold text-[#102F6B]">Insert Image</span>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Sub-tabs: Cloudinary Upload vs Direct URL */}
            <div className="flex border-b border-[#E2DDD5] gap-2 pb-1">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
                  imageTab === "upload"
                    ? "bg-[#102F6B] text-white"
                    : "text-[#55657E] hover:bg-[#FAF8F3]"
                }`}
              >
                Upload to Cloudinary
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
                  imageTab === "url"
                    ? "bg-[#102F6B] text-white"
                    : "text-[#55657E] hover:bg-[#FAF8F3]"
                }`}
              >
                From Image URL
              </button>
            </div>

            {uploadError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                {uploadError}
              </div>
            )}

            {imageTab === "upload" ? (
              <div className="space-y-3 py-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Select Image File (JPEG, PNG, WebP, GIF &lt; 5MB)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploadingImage}
                    onChange={handleUploadFile}
                    className="w-full text-xs text-[#55657E] file:mr-2 file:py-1 file:px-2.5 file:rounded-xs file:border-0 file:text-xs file:font-medium file:bg-[#102F6B] file:text-white hover:file:bg-[#0D1B2A] file:cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Image Caption / Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Gathering 2026"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#D5CEC4] rounded-xs text-xs"
                  />
                </div>

                {uploadingImage && (
                  <div className="p-3 bg-[#FAF8F3] border border-[#E2DDD5] text-center text-[#102F6B] font-medium animate-pulse rounded-xs">
                    Uploading image securely to Cloudinary CDN...
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleInsertUrlImage} className="space-y-3 py-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://res.cloudinary.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#D5CEC4] rounded-xs font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Image Caption / Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Community Memorial Hall"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#D5CEC4] rounded-xs text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(false)}
                    className="px-2.5 py-1 border border-[#D5CEC4] text-[#55657E] hover:bg-[#FAF8F3] rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#102F6B] hover:bg-[#0D1B2A] text-white font-medium rounded-xs"
                  >
                    Insert Image
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
