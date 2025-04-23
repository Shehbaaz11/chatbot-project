import "../../styles/globals.css"; // ✅ Import Global CSS

export const metadata = {
  title: "Chat - Medexa",
  description: "Chat with Medexa",
};

export default function ChatLayout({ children }) {
  return (
    <div className="chat-layout">
      {children}
    </div>
  );
}