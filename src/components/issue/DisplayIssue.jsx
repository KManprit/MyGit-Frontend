// src/components/DisplayIssues.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const DisplayIssues = ({ repositoryId }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any error

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`http://localhost:3000/issue/all`, {
        //   params: { repositoryId },
        // });
        const response = await axios.get(`http://localhost:3000/issue/${repositoryId}`)
        setIssues(response.data);
      } catch (error) {
        setError("Error fetching issues");
        console.error("Error fetching issues", error);
      } finally {
        setLoading(false);
      }
    };

    if (repositoryId) {
      fetchIssues();
    }
  }, [repositoryId]);

  if (loading) {
    return <p>Loading issues...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="issues-section">
      <h4>Reported Issues</h4>
      <ul>
        {issues.length > 0 ? (
          issues.map((issue) => (
            <li key={issue._id}>
              <h5>{issue.title}</h5>
              <p>{issue.description}</p>
              <p>Status: <strong>{issue.status || "Open"}</strong></p>
            </li>
          ))
        ) : (
          <p>No issues reported yet.</p>
        )}
      </ul>
    </div>
  );
};

export default DisplayIssues;
