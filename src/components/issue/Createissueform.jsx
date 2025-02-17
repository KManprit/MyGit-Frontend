import { useState, useEffect } from "react";
import axios from "axios";

const CreateIssueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repository, setRepository] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false); // For handling loading state
  const [issues, setIssues] = useState([]); // State for storing issues

  // Fetch repositories when component mounts
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/repo/all");
        setRepositories(response.data);
      } catch (error) {
        console.error("Error fetching repositories", error);
      }
    };

    fetchRepositories();
  }, []);

  // Fetch all issues when component mounts
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("http://localhost:3000/issue/all"); // Adjust this API as needed
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues", error);
      }
    };

    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check before submission
    if (!title || !description || !repository) {
      alert("All fields are required!");
      return;
    }

    setLoading(true); // Set loading to true when submitting

    try {
      const userId = localStorage.getItem("userId"); // Fetch logged-in user ID
      if (!userId) {
        alert("User not logged in!");
        return;
      }

      const newIssue = {
        title,
        description,
        repository,
        userId, // Include userId in the request body
      };

      const response = await axios.post("http://localhost:3000/issue/create", newIssue, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Issue created successfully!");
        // Optionally reset form fields
        setTitle("");
        setDescription("");
        setRepository("");

        // Update the issues state with the newly created issue
        setIssues((prevIssues) => [...prevIssues, response.data]);
      } else {
        alert("Failed to create issue.");
      }
    } catch (error) {
      console.error("Error creating issue:", error.response ? error.response.data : error);
      alert("Error creating issue!");
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="create-issue-form">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="repository">Repository</label>
        <select
          id="repository"
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
          required
        >
          <option value="">Select Repository</option>
          {repositories.map((repo) => (
            <option key={repo._id} value={repo._id}>
              {repo.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Issue"}
        </button>
      </form>

      {/* Display the list of issues */}
      <div className="issues-section">
        <h4>All Issues</h4>
        <ul>
          {issues.map((issue) => (
            <li key={issue._id}>
              <h5>{issue.title}</h5>
              <p>{issue.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateIssueForm;
