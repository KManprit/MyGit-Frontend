import React , {useState , useEffect } from "react";
import axios from "axios";
import Issue from "../../../../backend/models/issueModel";

const Issues = ({repositoryId})=>{
    const[issues , setIssues] = useState([]);
    const[title , setTitle] = useState("");
    const[description , setDescription ] = useState("");
    const[selectedIssue , setSelectedIssue] = useState(null);


    useEffect(()=>{
        const fetchIssues = async () => {
            try{
                const response = await axios.get(`http://localhost:3000/issue/all`);
                setIssues(response.data);
            }catch(err){
                console.error("Error fetching issues:", err.message);
            }
        };

        fetchIssues();
    },[]);


    // Create a new issue
    const createIssue  = async () =>{
        try{
            const response = await axios.post(`http://localhost:3000/issue/create`, {
                title,
                description,
                repository: repositoryId,
            });
            setIssues([...issues, response.data]); // Update the state
            setTitle("");
            setDescription("");

        }catch(err){
            console.error("Error creating issue:", error.message);
        }
    };


    // Update an issue
    const updateIssue = async () => {
        if (!selectedIssue) return;

        try{
            const response =  await axios.put(
                `http://localhost:3000/issue/update/${selectedIssue._id}`, 
                {
                    
                    title,
                    description,
                }

            );

            setIssues(
                issues.map((issue)=>
                    issue._id === selectedIssue._id ? response.data : issue
                )
            )

            setSelectedIssue(null);
            //  user doesn't see the old data after the update.
            setTitle("");
            setDescription("");
      
        }catch(err){
            console.error("Error updating issue:", err.message);
        }
    }

      // Delete an issue
      const deleteIssue = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/issue/delete/${id}`);
            setIssues(issues.filter((issue) => issue._id !== id)); // Remove from state
          } catch (err) {
            console.error("Error deleting issue:", err.message);
          }
      }



      return(
        <div>
             <h2>Manage Issues</h2>
               {/* Create/Update Form */}
               <div>
                <input
                  type="text"
                  placeholder="Issue Title"
                  value={title}
                  onChange={(e)=> setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Issue Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick = {selectedIssue ? updateIssue : createIssue}>
                    {selectedIssue ? "Update Issue" : "Create Issue"}
                </button>

                {selectedIssue && (
                <button
                onClick={() => {
                setSelectedIssue(null);
                setTitle("");
                setDescription("");
                }}
                >
                Cancel
               </button>
            )}

            </div>

            {/* Issues List */}
            <ul>
                {issues.map((issue) => (
                <li key={issue._id}>
                    <h3>{issue.title}</h3>
                    <p>{issue.description}</p>
                    <button
                    onClick={() => {
                        setSelectedIssue(issue);
                        setTitle(issue.title);
                        setDescription(issue.description);
                    }}
                    >
                    Edit
                    </button>
                    <button onClick={() => deleteIssue(issue._id)}>Delete</button>
                </li>
                ))}
           </ul>


        </div>
      )

}
export default Issues;