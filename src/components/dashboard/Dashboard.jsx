import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Fetch repositories and suggested repositories on component mount
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        console.log("User ID:", userId);

        const fetchRepositories = async () => {
            try {
                const response = await fetch(`http://16.171.78.108:3000/repo/user/${userId}`);
                const data = await response.json();
                console.log("Fetched repositories data:", data);
                setRepositories(data.repositories || []);
            } catch (err) {
                console.error("Error while fetching repositories:", err);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const response = await fetch(`http://16.171.78.108:3000/repo/all`);
                const data = await response.json();
                console.log("Fetched suggested repositories:", data);
                setSuggestedRepositories(data || []);
            } catch (err) {
                console.error("Error while fetching suggested repositories:", err);
            }
        };

        fetchRepositories();
        fetchSuggestedRepositories();
    }, []);

    // Handle search functionality
    useEffect(() => {
        if (searchQuery === "") {
            setSearchResults(repositories); // Show all repositories if no search query
        } else {
            const filteredRepo = repositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filteredRepo);
        }
    }, [searchQuery, repositories]);


    const handleDelete = async (repoId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this repository?");
        if (!confirmDelete) return;
    
        try {
            const response = await fetch(`http://16.171.78.108:3000/repo/delete/${repoId}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                alert("Repository deleted successfully!");
                setRepositories((prevRepos) => prevRepos.filter((repo) => repo._id !== repoId));
                setSearchResults((prevResults) => prevResults.filter((repo) => repo._id !== repoId));
            } else {
                alert("Failed to delete repository.");
            }
        } catch (err) {
            console.error("Error while deleting repository:", err);
            alert("Error deleting repository.");
        }
    };
    






    return (
        <>
            <Navbar />
    
            
    
           
            <section id="dashboard">
                
                <aside>
                    <h3>Suggested Repositories</h3>
                    <div className="card-container">
                        {suggestedRepositories.length > 0 ? (
                            suggestedRepositories.map((repo) => (
                                <div className="card" key={repo._id}>
                                    <h4>{repo.name}</h4>
                                    <p>{repo.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No suggested repositories available.</p>
                        )}
                    </div>
                </aside>
    
               
                <main>
                    <h3>Your Repositories</h3>
                    <div id="search">
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="card-container">
                        {searchResults.length > 0 ? (
                            searchResults.map((repo) => (
                                <div className="card" key={repo._id}>
                                    <h4>{repo.name}</h4>
                                    <p>{repo.description}</p>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(repo._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No repositories found matching your search.</p>
                        )}
                    </div>
                </main>
    
               
                <aside>
                    <h3>Upcoming Events</h3>
                    <div className="card-container">
                        <div className="card">Tech Conference - Dec 15</div>
                        <div className="card">Developer Meetup - Dec 25</div>
                        <div className="card">React Summit - Jan 5</div>
                    </div>
                </aside>
            </section>
        </>
    );
    
};

export default Dashboard;
