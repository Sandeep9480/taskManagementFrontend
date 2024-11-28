import { useEffect, useState } from "react";
import "./styles1.css";
import axios from "axios";
import { BASE_URL } from "../clientServer";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  const calculateHours = (start, end) =>
    Math.max(0, (new Date(end) - new Date(start)) / (1000 * 60 * 60));

  const calculateSummaryData = (tasks) => {
    const totalTasks = tasks.length;
    const finishedTasks = tasks.filter((task) => task.status === "Finished");
    const finishedCount = finishedTasks.length;

    const averageTime =
      finishedTasks.reduce((sum, task) => sum + (task.timeTaken || 0), 0) /
      (finishedCount || 1);

    return {
      totalTasks,
      tasksFinished: `${((finishedCount / totalTasks) * 100).toFixed(1)}%`,
      tasksPending: `${(
        ((totalTasks - finishedCount) / totalTasks) *
        100
      ).toFixed(1)}%`,
      averageTime: `${averageTime.toFixed(1)} hrs`,
    };
  };

  const calculatePendingSummary = (tasks) => {
    const pendingTasks = tasks.filter((task) => task.status === "Pending");

    const totalTimeLapsed = pendingTasks.reduce(
      (sum, task) => sum + calculateHours(task.start_time, new Date()),
      0
    );

    const totalTimeToFinish = pendingTasks.reduce(
      (sum, task) => sum + calculateHours(new Date(), task.end_time),
      0
    );

    return {
      pendingTasks: pendingTasks.length,
      timeLapsed: `${totalTimeLapsed.toFixed(1)} hrs`,
      timeToFinish: `${totalTimeToFinish.toFixed(1)} hrs`,
    };
  };

  const calculatePriorityData = (tasks) => {
    const priorities = [1, 2, 3, 4, 5];
    return priorities.map((priority) => {
      const filteredTasks = tasks.filter(
        (task) => task.priority === priority && task.status === "Pending"
      );

      const timeLapsed = filteredTasks.reduce(
        (sum, task) => sum + calculateHours(task.start_time, new Date()),
        0
      );

      const timeToFinish = filteredTasks.reduce(
        (sum, task) => sum + calculateHours(new Date(), task.end_time),
        0
      );

      return {
        priority,
        pendingTasks: filteredTasks.length,
        timeLapsed: `${timeLapsed.toFixed(1)} hrs`,
        timeToFinish: `${timeToFinish.toFixed(1)} hrs`,
      };
    });
  };

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get_all_tasks`, {
          params: { token: localStorage.getItem("token") },
        });
        setTasks(response.data.allTasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const summaryData = calculateSummaryData(tasks);
  const pendingSummary = calculatePendingSummary(tasks);
  const priorityData = calculatePriorityData(tasks);

  return (
    <div className="dashboard">
      <main className="main">
        <h1 className="title">Dashboard</h1>

        {/* Summary Section */}
        <section className="summary-section">
          <h2 className="section-title">Summary</h2>
          <div className="stats-grid">
            {[
              { label: "Total tasks", value: summaryData.totalTasks },
              { label: "Tasks Finished", value: summaryData.tasksFinished },
              { label: "Tasks Pending", value: summaryData.tasksPending },
              { label: "Avg time per task", value: summaryData.averageTime },
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pending-summary">
          <h2 className="section-title">Pending Tasks</h2>
          <div className="stats-grid">
            {[
              { label: "Pending tasks", value: pendingSummary.pendingTasks },
              { label: "Time Lapsed", value: pendingSummary.timeLapsed },
              { label: "Time to Finish", value: pendingSummary.timeToFinish },
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="table-container">
          <table className="priority-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Pending Tasks</th>
                <th>Time Lapsed</th>
                <th>Time to Finish</th>
              </tr>
            </thead>
            <tbody>
              {priorityData.map((row) => (
                <tr key={row.priority}>
                  <td>{row.priority}</td>
                  <td>{row.pendingTasks}</td>
                  <td>{row.timeLapsed}</td>
                  <td>{row.timeToFinish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
