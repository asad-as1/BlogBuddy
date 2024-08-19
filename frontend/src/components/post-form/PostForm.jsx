import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { upload } from "../../firebase";

export default function PostForm({ post }) {
    const { register, handleSubmit, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            categories: post?.categories || "",
            content: post?.content || "",
            status: post?.status || "Public",
        },
    });

    const [mediaPreview, setMediaPreview] = useState(post?.media || "");
    const [isVideo, setIsVideo] = useState(false);
    const navigate = useNavigate();

    const submit = async (data) => {
        // console.log(data)
        try {
            if (data.media) {
                const url = await upload(data.media);
                data.media = url;
            }

            const res = await axios.post("http://localhost:5000/post/newPost", data);
            // console.log("Post Uploaded sucessfully")
            navigate("/"); // Adjust this route as needed
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
            
            // Manually set the file in react-hook-form
            setValue("media", file);
        } else {
            setMediaPreview("");
            setIsVideo(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
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
            <div className="w-1/3 px-2">
                <input
                    label="Featured Media :"
                    type="file"
                    className="mb-4"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                />
                {mediaPreview && (
                    <div className="w-full mb-4">
                        {isVideo ? (
                            <video controls className="rounded-lg">
                                <source src={mediaPreview} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={mediaPreview}
                                alt="Featured"
                                className="rounded-lg"
                            />
                        )}
                    </div>
                )}
                <Select
                    options={["Public", "Private"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
