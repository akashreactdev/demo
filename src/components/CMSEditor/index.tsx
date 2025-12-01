import React, { useMemo } from "react";
import JoditEditor from "jodit-react";

interface CMSEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string | number;
  placeholder?: string;
}

const CMSEditor: React.FC<CMSEditorProps> = ({
  value,
  onChange,
  height = "calc(100vh - 300px)",
  placeholder = " ",
}) => {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder,
      width: "auto",
      height: height,
      buttons: [
        "font",
        "underline",
        "bold",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "table",
        "outdent",
        "indent",
        "|",
        "brush",
        "paragraph",
        "|",
        "link",
        "image",
        "align",
        "|",
        "source",
        "|",
        "undo",
        "redo",
      ],
    }),
    [height, placeholder]
  );

  return (
    <JoditEditor
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
      onChange={() => {}}
    />
  );
};

export default CMSEditor;
