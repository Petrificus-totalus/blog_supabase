import { fetchProjectById } from "@/lib/projectApi";

export default async function ProjectDetailPage({ params }) {
  const id = params?.id; // 加一层容错
  if (!id) return <p>Invalid project ID</p>;

  const project = await fetchProjectById(id);

  if (!project) return <p>Project not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{project.name}</h1>
      <p>
        <strong>Category:</strong> {project.category}
      </p>
      <p>
        <strong>Duration:</strong> {project.duration}
      </p>
      <p>
        <strong>Tech Stack:</strong> {project.stack}
      </p>
      <p>
        <strong>Summary:</strong>
      </p>
      <p>{project.summary}</p>
      <p>
        <a href={project.link} target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      </p>
    </div>
  );
}
