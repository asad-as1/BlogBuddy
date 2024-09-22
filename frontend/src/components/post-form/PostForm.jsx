import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { upload } from "../../firebase";
import { htmlToText } from 'html-to-text';

export default function PostForm({ post }) {
  const { register, handleSubmit, setValue, control, getValues, formState: { errors }, setError } = useForm({
    defaultValues: {
      title: post?.title || "",
      categories: post?.categories || "",
      content: post?.content || "",
      isPublished: post?.isPublished || "Public",
    },
  });

  const [mediaPreview, setMediaPreview] = useState(post?.media?.url || "");
  const [isVideo, setIsVideo] = useState(post?.media?.isVideo || false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTime, setUploadTime] = useState(null);
  const [fileError, setFileError] = useState(""); // File input error
  const navigate = useNavigate();

  const submit = async (data) => {
    if (!data.media && !post?.media) {
      setFileError("Featured media is required");
      return;
    }

    if (!data.content) {
      setError("content", { type: "required", message: "Content is required" });
      return;
    }

    try {
      if (data.media) {
        const startTime = Date.now();
        const url = await upload(data.media, (progress) => {
          setUploadProgress(progress);
        });
        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

        data.media = {
          url: url,
          isVideo: isVideo,
        };
        setUploadTime(timeTaken);
      } else if (post) {
        data.media = post.media;
      }

      if (post) {
        await axios.put(`${import.meta.env.VITE_URL}post/${post._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_URL}post/newPost`, data, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setFileError(""); // Reset file error when new file is selected

    if (file) {
      const fileType = file.type.split("/")[0];
      setIsVideo(fileType === "video");

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Handle video duration check if the file is a video
      if (fileType === "video") {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 60) {
            setFileError("Video duration should not exceed 60 seconds.");
            setMediaPreview("");
            setValue("media", null);
            setIsVideo(false);
          } else {
            setValue("media", file);
            setUploadProgress(0);
            setUploadTime(null);
          }
        };
      } else {
        setValue("media", file);
        setUploadProgress(0);
        setUploadTime(null);
      }
    } else {
      setMediaPreview("");
      setIsVideo(false);
      setValue("media", null);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col sm:flex-row flex-wrap">
      <div className="w-full sm:w-2/3 px-2 mb-4 sm:mb-0">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-1"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        
        <Input
          label="Categories :"
          placeholder="Categories"
          className="mb-1"
          {...register("categories", { required: "Categories are required" })}
        />
        {errors.categories && <p className="text-red-500">{errors.categories.message}</p>}

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          rules={{ required: "Content is required" }}
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      </div>

      <div className="w-full sm:w-1/3 px-2">
        <Input
          label="Featured Media :"
          type="file"
          className="mb-4"
          accept="image/*,video/*"
          onChange={handleMediaChange}
        />
        {fileError && <p className="text-red-500">{fileError}</p>}
        {mediaPreview && (
          <div className="w-full mb-4">
            {isVideo ? (
              <video controls className="w-full rounded-lg">
                <source src={mediaPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={mediaPreview} alt="Featured" className="w-full rounded-lg" />
            )}
          </div>
        )}
        {uploadProgress > 0 && (
          <div className="w-full mb-4">
            <p>Uploading: {uploadProgress}%</p>
            {uploadTime && <p>Time taken: {uploadTime} seconds</p>}
          </div>
        )}

        <Select
          options={["Public", "Private"]}
          label="Status"
          className="mb-4"
          {...register("isPublished", { required: "Status is required" })}
        />        
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
