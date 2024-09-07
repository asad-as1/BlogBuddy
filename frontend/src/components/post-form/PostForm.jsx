import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { upload } from "../../firebase";
import { htmlToText } from 'html-to-text';  

export default function PostForm({ post }) {
  const { register, handleSubmit, setValue, control, getValues } = useForm({
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
  const navigate = useNavigate();

  const submit = async (data) => {
    try {
      // data.content = htmlToText(data.content);

      if (data.media) {
        // New media file is provided
        const startTime = Date.now();
        const url = await upload(data.media, (progress) => {
          setUploadProgress(progress);
        });
        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // in seconds
  
        data.media = {
          url: url,
          isVideo: isVideo,
        };
        setUploadTime(timeTaken);
      } else if (post) {
        // No new media file, preserve existing media
        data.media = post.media;
      }
  
      if (post) {
        // Update existing post
        await axios.put(`http://localhost:5000/post/${post._id}`, data, {
          withCredentials: true,
        });
      } else {
        // Create new post
        await axios.post("http://localhost:5000/post/newPost", data, {
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
    
    if (file) {
      const fileType = file.type.split("/")[0];
      setIsVideo(fileType === "video");

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setValue("media", file); // Set the new media file
      setUploadProgress(0);
      setUploadTime(null);
    } else {
      setMediaPreview("");
      setIsVideo(false);
      setValue("media", null); // Clear the media file
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col sm:flex-row flex-wrap">
      <div className="w-full sm:w-2/3 px-2 mb-4 sm:mb-0">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Categories :"
          placeholder="Categories"
          className="mb-4"
          {...register("categories", { required: true })}
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>
      <div className="w-full sm:w-1/3 px-2">
        <Input
          label="Featured Media :"
          type="file"
          className="mb-4"
          accept="image/*,video/*"
          onChange={handleMediaChange}
        />
        {mediaPreview && (
          <div className="w-full mb-4">
            {isVideo ? (
              <video controls className="w-full rounded-lg">
                <source src={mediaPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={mediaPreview}
                alt="Featured"
                className="w-full rounded-lg"
              />
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
          {...register("isPublished", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
