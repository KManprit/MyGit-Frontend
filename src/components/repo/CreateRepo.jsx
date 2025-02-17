import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateRepo.css";
const CreateRepo = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [owner, setOwner] = useState(null);
    // const [repoId, setRepoId] = useState("");
    const navigate = useNavigate();

    // Fetch userID from localStorage when component mounts
    useEffect(() => {
        const storedUserID = localStorage.getItem("userId");
        console.log("Stored User ID:", storedUserID);
        if (storedUserID) {
            setOwner(storedUserID);
        } else {
            // alert("User not logged in. Redirecting to login page.");
            // navigate("/auth"); // Redirect to login if userID is missing
            alert("User is not logged in");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!owner) {
            alert("User ID is missing! Please log in again.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/repo/create", {
                owner,
                name,
                description,
                visibility,
                content: [],
                issues: [],
            });

            console.log("Repository Created:", response.data);
            alert("Repository Created Successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Error creating repository:", error);
            alert("Failed to create repository");
        }
    };

    // const handleDelete = async () => {
    //     if (!repoId.trim()) {
    //         alert("Please enter a valid Repo Id to delete");
    //         return;
    //     }
    
    //     console.log("Deleting Repo ID:", repoId); // Debugging
    
    //     try {
    //         const response = await axios.delete(`http://localhost:3000/repo/delete/${repoId}`, {
    //             headers: { "Content-Type": "application/json" },
    //         });
    
    //         console.log("Delete Response:", response.data);
    //         alert("Repository Deleted Successfully");
    
    //         setRepoId(""); // UI se repoId hata do
    //     } catch (error) {
    //         console.error("Error deleting repository:", error.response?.data || error.message);
    //         alert("Failed to delete repository");
    //     }
    // };
    
    

    return (
        <div className="create-repo-container">
            <div className="form-box">
                <h2>Create a New Repository</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Repository Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={visibility}
                            onChange={(e) => setVisibility(e.target.checked)}
                        />
                        Public
                    </label>
                    <button type="submit">Create</button>
                </form>


                {/* <h2>Delete a Repository</h2>
                <input
                    type="text"
                    placeholder="Enter Repository ID"
                    value={repoId}
                    onChange={(e) => setRepoId(e.target.value)}
                />

                <button onClick={handleDelete }>Delete</button> */}
            </div>
        </div>
    );
};

export default CreateRepo;
