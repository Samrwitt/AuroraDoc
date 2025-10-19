"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export function useAcademicEditor() {
  return useEditor({
    extensions: [
      StarterKit.configure({
        // 🔧 you had `heading: { {` previously. Keep it a single object.
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your academic paper..." }),
    ],
    content: `<h1>Deep Learning Approaches to Academic Writing</h1>
<h2>Abstract</h2>
<p>This paper explores the intersection of artificial intelligence and academic writing tools, examining how modern collaborative editors can enhance research productivity through intelligent assistance and real-time collaboration features.</p>
<h2>Introduction</h2>
<p>The landscape of academic writing has evolved significantly over the past decade. Traditional word processors have given way to more sophisticated tools that incorporate real-time collaboration, version control, and intelligent assistance.</p>
<h3>Background</h3>
<p>Previous research has shown that collaborative writing tools can improve both the quality and efficiency of academic output (Smith et al., 2023). However, many existing solutions fail to address the specific needs of academic writers, particularly in fields requiring mathematical notation and citation management.</p>
<h3>Motivation</h3>
<p>This work aims to bridge the gap between general-purpose writing tools and specialized academic publishing systems. We propose an integrated approach that combines the ease of use of modern collaborative editors with the power of professional typesetting systems.</p>
<h2>Methods</h2>
<p>Our approach combines several key technologies:</p>
<ol>
  <li>Real-time collaborative editing using CRDTs</li>
  <li>LaTeX rendering for mathematical expressions</li>
  <li>Integrated citation management</li>
  <li>Automated document compilation</li>
</ol>
<h2>Results</h2>
<p>Initial testing shows promising results...</p>`,
    editorProps: {
      attributes: {
        class: "prose-editor focus:outline-none",
        style:
          'font-family: Georgia, Cambria, "Times New Roman", Times, serif; font-size: 16px; line-height: 1.75;',
      },
    },
    // 🔑 Critical for Next.js to avoid hydration mismatch
    immediatelyRender: false,
  });
}
