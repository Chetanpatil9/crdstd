import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;
  const [showModal, setShowModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [name, setNewname] = useState("");
  const [email, setNewemail] = useState("");
  const [mobile, setNewmobile] = useState("");
  const [age, setNewage] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [marksStudentId, setMarksStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [studentMarks, setStudentMarks] = useState([]);

  const [showViewMarksModal, setShowViewMarksModal] = useState(false);
  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchStudents = () => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setStudents(res.data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const editStudent = async (id) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users${id}`);
      const student = response.data;

      setNewname(student.name);
      setNewemail(student.email);
      setNewmobile(student.mobile);
      setNewage(student.age);
      setEditingStudent(student);

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Failed to fetch student details.");
    }
  };

  const saveStudent = async () => {
    try {
      if (editingStudent) {
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users${editingStudent.id}`,
          { name, email, mobile, age }
        );

        alert(response.data.message || "Student updated successfully!");
      } else {
        const response = await axios.post("https://jsonplaceholder.typicode.com/users", {
          name, email, mobile, age,
        });

        alert(response.data.message || "Student data added successfully!");
      }

      setShowModal(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student.");
    }
  };

  const deleteStudent = async (id) => {
    
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/users${id}`);
        alert("Student deleted successfully!");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student data.");
      }
    }
  };

  const addStudentMarks = async () => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", {
        student_id: marksStudentId,
        subject,
        marks,
      });

      alert(response.data.message || "Data added successfully!");
      setShowMarksModal(false);
      setMarksStudentId("");
      setSubject("");
      setMarks("");
    } catch (error) {
      console.error("Error adding marks:", error);
      alert("Failed to add data.");
    }
  };
  const viewStudentMarks = async (id) => {
    console.log("Fetching marks for student ID:", id);  // Debugging
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users${id}`);
      console.log("Marks data:", response.data);
      setStudentMarks(response.data);
      setShowViewMarksModal(true);
    } catch (error) {
      console.error("Error fetching student marks:", error);
      alert("Failed to fetch data.");
    }
  };



  
  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h3>Student List</h3>
          <button className="btn btn-primary" onClick={() => {
            setEditingStudent(null);
            setNewname("");
            setNewemail("");
            setNewmobile("");
            setNewage("");
            setShowModal(true);
          }}>Add Student</button>
        </div>

        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Zipcode</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{index+1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.mobile}</td>
                <td>{student.age}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => editStudent(student.id)}>Edit</button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => deleteStudent(student.id)}>Delete</button>
                  <button className="btn btn-info btn-sm" onClick={() => {
                    setMarksStudentId(student.id);
                    setShowMarksModal(true);
                  }}>Add Data</button>

{student.id && (
                  <button className="btn btn-success btn-sm ms-2" onClick={() => viewStudentMarks(student.id)}>View Data</button>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(students.length / studentsPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Student Modal */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingStudent ? "Edit Student" : "Add Student"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder="Name" value={name} onChange={(e) => setNewname(e.target.value)} />
                  <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setNewemail(e.target.value)} />
                  <input type="text" className="form-control mb-2" placeholder="Mobile" value={mobile} onChange={(e) => setNewmobile(e.target.value)} />
                  <input type="number" className="form-control mb-2" placeholder="Age" value={age} onChange={(e) => setNewage(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={saveStudent}>{editingStudent ? "Update" : "Save"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Modal */}
        {showMarksModal && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Data</h5>
                  <button type="button" className="btn-close" onClick={() => setShowMarksModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder="Data" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  <input type="number" className="form-control mb-2" placeholder="Number" value={marks} onChange={(e) => setMarks(e.target.value)} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={addStudentMarks}>Save Data</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* View Data Modal */}
      {showViewMarksModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Student Data</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewMarksModal(false)}></button>
              </div>
              <div className="modal-body">
                {studentMarks.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Numbers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMarks.map((mark, index) => (
                        <tr key={index}>
                          <td>{mark.subject}</td>
                          <td>{mark.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No data available for this student.</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowViewMarksModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default App;
