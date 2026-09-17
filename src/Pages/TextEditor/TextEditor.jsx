import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [
        {
          color: [
            "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00",
            "#0066cc", "#9933ff", "#ffffff", "#888888", "#ff007f",
            "#00bcd4", "#ff5722", "#9c27b0", "#4caf50", "#cddc39",
            "#ffeb3b", "#ff9800", "#795548", "#607d8b", "#f44336"
          ],
        },
        {
          background: [
            "#ffffff", "#ffff00", "#ffeb3b", "#ffc107",
            "#ffe0b2", "#fce4ec", "#e0f7fa", "transparent",
            "#c8e6c9", "#d1c4e9", "#ffccbc", "#b2ebf2"
          ],
        },
      ],
      [{ script: "sub" }, { script: "super" }],
      [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Product Description
      </label>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write your product description here..."
        className="border border-gray-300 rounded-lg text-gray-800 min-h-[100px] resize-y overflow-auto focus:ring-2 focus:ring-green-500"
        style={{ width: "100%" }}
      />
    </div>
  );
}

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

