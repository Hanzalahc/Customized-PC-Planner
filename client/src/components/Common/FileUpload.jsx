import React, { memo } from "react";
import "./fileUpload.css";
import { IoMdCloudUpload } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";

const FileUpload = ({ files, setFiles, limit = 1 }) => {
  const { useRef, apis } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();

  const fileRef = useRef();

  const fileClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const fileChange = async (event) => {
    const formatedArray = Array.from(event.target.files);
    const slicedArray = formatedArray.slice(0, limit - files.length);

    for (let img of slicedArray) {
      await upload(img);
    }
  };

  const removeHandler = async (index) => {
    const imagePublicId = files[index].publicId;

    // const response = await apiSubmit({
    //   url: apis().deleteImage.url,
    //   method: apis().deleteImage.method,
    //   values: { imagePublicId: imagePublicId },
    //   successMessage: "File Deleted Successfully",
    //   showLoadingToast: true,
    //   loadingMessage: "Deleting File, please wait...",
    // });

    // if (response.success) {

    // }

    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  async function upload(image) {
    const formData = new FormData();
    formData.append("image", image);

    const response = await apiSubmit({
      url: apis().image.url,
      method: apis().image.method,
      values: formData,
      successMessage: "File Uploaded Successfully",
      showLoadingToast: true,
      loadingMessage: "Uploading File, please wait...",
    });

    if (response?.success || response.success) {
      setFiles((prevFiles) => [...prevFiles, response.image.image]);
    }
  }

  return (
    <div className="file_upload_main">
      <div onClick={fileClick} className="file_upload_section">
        <input
          ref={fileRef}
          type="file"
          onChange={fileChange}
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          style={{ display: "none" }}
        />
        <IoMdCloudUpload />
        <span>Upload Images</span>
      </div>
      <div className="file_previews">
        {files?.map((item, index) => (
          <div className="single_preview relative" key={index}>
            <img
              src={item?.image?.url ? item?.image?.url : item?.url}
              alt="file preview"
            />
            <button
              className="remove_button"
              onClick={() => removeHandler(index)}
              aria-label="Remove file"
            >
              <IoCloseSharp />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(FileUpload);
