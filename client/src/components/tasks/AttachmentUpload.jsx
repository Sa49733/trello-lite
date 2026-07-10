import { FaPaperclip } from "react-icons/fa";

function AttachmentUpload({
  attachments,
  setAttachments,
}) {
  const handleFileChange = (e) => {
    setAttachments(
      Array.from(e.target.files)
    );
  };

  return (
    <div className="md:col-span-2">

      <label className="block font-semibold mb-3">

        <span className="flex items-center gap-2">

          <FaPaperclip />

          Attach Files

        </span>

      </label>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full border rounded-xl p-3"
      />

      {attachments.length > 0 && (

        <div className="mt-4 space-y-2">

          {attachments.map(
            (file, index) => (

              <div
                key={index}
                className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3"
              >

                <FaPaperclip className="text-blue-600" />

                <span>

                  {file.name}

                </span>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default AttachmentUpload;