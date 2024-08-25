import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { notifyError, notifySuccess } from "../components/Notification";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    return (
        <div className="dark:bg-slate-800 min-h-screen">
            <Appbar />

            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg block p-2.5 focus:outline-none"
                        placeholder="Title"
                    />

                    <TextEditor
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />

                    <button
                        onClick={async () => {
                            try {
                                const response = await axios.post(`${BACKEND_URL}/api/v1/blog/publish`, {
                                    title,
                                    content: description
                                }, {
                                    headers: {
                                        Authorization: localStorage.getItem("token")
                                    }
                                });

                                navigate(`/blog/${response.data.id}`);

                                notifySuccess('Post Published Successfully');

                            } catch (error) {
                                console.error("Publish post error:", error);
                                if (error.response && error.response.status === 403) {
                                    notifyError('You are not logged in, please login first to post.');
                                } else {
                                    notifyError('Failed to publish post. Please try again.');
                                }
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none mt-4"
                    >
                        Publish Post
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem("token");
                                if (!token) {
                                    notifyError('Token is missing. Please login first.');
                                    return;
                                }

                                const response = await axios.post(`${BACKEND_URL}/api/v1/blog/with-ai`, {
                                    title
                                }, {
                                    headers: {
                                        Authorization: localStorage.getItem("token")
                                    }
                                });

                                setDescription(response.data.content); // Update the description with AI
                                notifySuccess('Content generated successfully.');

                            } catch (error) {
                                console.error("Generate with AI error:", error); // Log error details
                                if (error.response && error.response.status === 403) {
                                    notifyError('You are not logged in, please login first to generate.');
                                } else {
                                    notifyError('Failed to generate content. Please try again.');
                                }
                            }
                        }}
                        className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-3 px-4 rounded-lg focus:outline-none mt-4 mx-4"
                    >
                        Generate with AI
                    </button>

                </div>
            </div>
        </div>
    );
}

export function TextEditor({ value, onChange }: { value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center bg-white justify-between border rounded-lg">
                    <div className="my-2 rounded-lg w-full">
                        <label className="sr-only">Publish post</label>
                        <textarea
                            value={value}
                            onChange={onChange}
                            id="editor"
                            rows={8}
                            className="focus:outline-none block w-full px-4 py-2 text-lg text-gray-800 bg-white border-0 rounded-lg"
                            placeholder="Write an article..."
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Publish;
