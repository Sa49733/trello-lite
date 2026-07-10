import {
  FaPaperclip,
  FaExternalLinkAlt,
  FaDownload,
} from "react-icons/fa";

function AttachmentList({
  attachments,
}) {
  if (
    !attachments ||
    attachments.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-3">

      {attachments.map(
        (file, index) => (

          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-100 hover:bg-slate-200 rounded-xl p-4 transition"
          >

            <div className="flex items-center gap-3">

              <div className="bg-blue-600 text-white p-3 rounded-full">

                <FaPaperclip />

              </div>

              <div>

                <h4 className="font-semibold break-all">

                  {file.originalname}

                </h4>

                <p className="text-sm text-gray-500">

                  {(file.size / 1024).toFixed(2)} KB

                </p>

              </div>

            </div>

            <div className="flex gap-3 mt-4 md:mt-0">

              {/* Open */}

              <a
                href={`http://localhost:5000/${file.path}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >

                <FaExternalLinkAlt />

                Open

              </a>

              {/* Download */}

              <a
                href={`http://localhost:5000/${file.path}`}
                download
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >

                <FaDownload />

                Download

              </a>

            </div>

          </div>

        )
      )}

    </div>
  );
}

export default AttachmentList;