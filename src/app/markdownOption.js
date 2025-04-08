import Code from "@/component/Code/code";

const markdownOptions = {
  overrides: {
    code: {
      component: Code,
    },
    h1: {
      component: ({ children }) => (
        <h1 style={{ margin: "20px 0 5px 0" }}>{children}</h1>
      ),
    },
    h2: {
      component: ({ children }) => (
        <h2 style={{ margin: "10px 0 5px 0" }}>{children}</h2>
      ),
    },
    li: {
      component: ({ children }) => (
        <li style={{ marginLeft: "20px", marginBottom: "5px" }}>{children}</li>
      ),
    },
    strong: {
      component: ({ children }) => (
        <strong
          style={{
            color: "#d9702b",
            margin: "0 5px",
            padding: "2px",
            backgroundColor: "#f8f8f8",
          }}
        >
          {children}
        </strong>
      ),
    },
    img: {
      component: ({ src, alt }) => (
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "40%",
            height: "auto",
          }}
        />
      ),
    },
    table: {
      component: ({ children }) => (
        <table
          style={{
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          {children}
        </table>
      ),
    },
    thead: {
      component: ({ children }) => (
        <thead
          style={{
            backgroundColor: "#f4f4f4",
          }}
        >
          {children}
        </thead>
      ),
    },
    tbody: {
      component: ({ children }) => (
        <tbody
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          {children}
        </tbody>
      ),
    },
    tr: {
      component: ({ children }) => (
        <tr
          style={{
            borderBottom: "1px solid #ddd",
          }}
        >
          {children}
        </tr>
      ),
    },
    th: {
      component: ({ children }) => (
        <th
          style={{
            padding: "10px",
            textAlign: "left",
            fontWeight: "bold",
            borderRight: "1px solid #ddd",
            borderBottom: "2px solid #ddd",
          }}
        >
          {children}
        </th>
      ),
    },
    td: {
      component: ({ children }) => (
        <td
          style={{
            padding: "10px",
            textAlign: "left",
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          {children}
        </td>
      ),
    },
  },
};

export default markdownOptions;
