import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "התחל לכתוב..." 
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image', 'color', 'background'
  ];

  return (
    <div className="rich-text-editor" dir="rtl">
      <style>{`
        .rich-text-editor .ql-container {
          font-family: 'Heebo', sans-serif;
          font-size: 16px;
          border-radius: 0 0 12px 12px;
          border: 1px solid hsl(var(--border));
          background: white;
        }
        .rich-text-editor .ql-toolbar {
          border-radius: 12px 12px 0 0;
          border: 1px solid hsl(var(--border));
          background: white;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
          color: hsl(var(--brand-text));
          padding: 20px;
          line-height: 1.8;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: hsl(var(--brand-text-secondary));
          font-style: normal;
        }
        .rich-text-editor .ql-snow .ql-tooltip {
          background: white;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .rich-text-editor .ql-snow .ql-picker-options {
          background: white;
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
        }
        .rich-text-editor .ql-snow .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        .rich-text-editor .ql-snow .ql-fill {
          fill: hsl(var(--foreground));
        }
        .rich-text-editor .ql-snow .ql-picker-label:hover,
        .rich-text-editor .ql-snow .ql-picker-item:hover {
          background: hsl(var(--accent) / 0.1);
        }
        .rich-text-editor .ql-snow .ql-picker-label:hover .ql-stroke,
        .rich-text-editor .ql-snow button:hover .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-text-editor .ql-snow .ql-picker-label:hover .ql-fill,
        .rich-text-editor .ql-snow button:hover .ql-fill {
          fill: hsl(var(--primary));
        }
        .rich-text-editor .ql-snow button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-text-editor .ql-snow button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;