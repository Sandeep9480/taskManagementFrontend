import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { BASE_URL } from "./../clientServer";
import { useNavigate } from "react-router-dom";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: 1,
    status: "Pending",
    start_time: "",
    end_time: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get_all_tasks`, {
          params: {
            token: localStorage.getItem("token"),
          },
        });
        setTasks(response.data.allTasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let filteredTasks = [...tasks];

    if (filterPriority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toString() === filterPriority
      );
    }

    if (filterStatus) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filterStatus
      );
    }

    if (sortOption) {
      switch (sortOption) {
        case "priority-asc":
          filteredTasks.sort((a, b) => a.priority - b.priority);
          break;
        case "priority-desc":
          filteredTasks.sort((a, b) => b.priority - a.priority);
          break;
        case "start-asc":
          filteredTasks.sort(
            (a, b) => new Date(a.start_time) - new Date(b.start_time)
          );
          break;
        case "start-desc":
          filteredTasks.sort(
            (a, b) => new Date(b.start_time) - new Date(a.start_time)
          );
          break;
        case "end-asc":
          filteredTasks.sort(
            (a, b) => new Date(a.end_time) - new Date(b.end_time)
          );
          break;
        case "end-desc":
          filteredTasks.sort(
            (a, b) => new Date(b.end_time) - new Date(a.end_time)
          );
          break;
        default:
          break;
      }
    }

    setTasks(filteredTasks);
  }, [filterPriority, filterStatus, sortOption]);

  const handleAddTask = async () => {
    try {
      if (!newTask.title.trim()) {
        alert("Task title is required.");
        return;
      }
      if (!newTask.start_time || !newTask.end_time) {
        alert("Start and End times are required.");
        return;
      }
      if (new Date(newTask.start_time) >= new Date(newTask.end_time)) {
        alert("End time must be after Start time.");
        return;
      }

      const response = await axios.post(`${BASE_URL}/add_task`, {
        token: localStorage.getItem("token"),
        title: newTask.title,
        priority: newTask.priority,
        start_time: newTask.start_time,
        end_time: newTask.end_time,
      });

      if (response.data && response.data.task) {
        setTasks([...tasks, response.data.task]);
        setShowAddModal(false);
        setNewTask({
          title: "",
          priority: 1,
          status: "Pending",
          start_time: "",
          end_time: "",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask({
      ...task,
      start_time: formatDateForInput(task.start_time),
      end_time: formatDateForInput(task.end_time),
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/update_task`, {
        task_id: editingTask._id,
        ...editingTask,
      });

      if (response.data.message === "Task Updated Successfully") {
        setTasks(
          tasks.map((task) =>
            task._id === editingTask._id ? response.data.updatedTask : task
          )
        );
        setShowEditModal(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="task-management">
      <main className="main">
        <h1 className="title">Task list</h1>
        <div className="table-container">
          <div className="table-actions">
            <div className="left-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <span className="plus-icon">+</span> Add task
              </button>
              <button className="btn btn-danger">
                <span className="delete-icon">🗑</span> Delete selected
              </button>
            </div>
            <div className="right-actions">
              <select
                className="btn btn-secondary"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">↕ Sort</option>

                <option value="start-asc">Start Time: ASC</option>
                <option value="start-desc">Start Time: DESC</option>
                <option value="end-asc">End Time: ASC</option>
                <option value="end-desc">End Time: DESC</option>
              </select>

              <select
                className="btn btn-secondary"
                onChange={(e) => setFilterPriority(e.target.value)}
                value={filterPriority}
              >
                <option value="">Priority</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <select
                className="btn btn-secondary"
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
          </div>

          <table className="task-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Task ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Time to Finish (hrs)</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{task._id}</td>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>
                    <span
                      className={`status-badge ${task.status.toLowerCase()}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{formatDateTime(task.start_time)}</td>
                  <td>{formatDateTime(task.end_time)}</td>
                  <td>
                    {(
                      (new Date(task.end_time) - new Date(task.start_time)) /
                      (1000 * 60 * 60)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(task)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <div className="modal-content">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="status-toggle">
                    <span
                      className={newTask.status === "Pending" ? "active" : ""}
                    >
                      Pending
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={newTask.status === "Finished"}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            status: e.target.checked ? "Finished" : "Pending",
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <span
                      className={newTask.status === "Finished" ? "active" : ""}
                    >
                      Finished
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={
                      newTask.start_time
                        ? new Date(newTask.start_time)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        start_time: new Date(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={
                      newTask.end_time
                        ? new Date(newTask.end_time).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        end_time: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleAddTask}>
                  Save Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>
            <div className="modal-content">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        priority: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="status-toggle">
                    <span
                      className={
                        editingTask.status === "Pending" ? "active" : ""
                      }
                    >
                      Pending
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={editingTask.status === "Finished"}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            status: e.target.checked ? "Finished" : "Pending",
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <span
                      className={
                        editingTask.status === "Finished" ? "active" : ""
                      }
                    >
                      Finished
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={
                      editingTask.start_time
                        ? new Date(editingTask.start_time)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        start_time: new Date(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={
                      editingTask.end_time
                        ? new Date(editingTask.end_time)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        end_time: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdateTask}>
                  Update Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
