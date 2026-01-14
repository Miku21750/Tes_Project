import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/hooks/useNotification";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";

export function GlobalLogListener() {
  const { user, loading } = useAuth();
  const { addNotification } = useNotifications(user?.id);

  useSocket("log:created", (log) => {
    const notif = {
      id: log.id,
      type: detectType(log),  // map log to created/updated/assigned/closed
      caseId: log.CaseId,
      user: log.changedBy,
      date: log.ChangeAt,
      description: log.logDescription,
    };

    addNotification(notif);

    toast.custom(() => (
      <div className="flex flex-col rounded-md border bg-white p-4 shadow-md w-[320px]">
        <div className="flex justify-between items-center mb-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColor(notif.type)}`}>
            {notif.type}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(notif.date).toLocaleString()}
          </span>
        </div>
        <div className="font-semibold text-gray-900">Case {notif.caseId}</div>
        <div className="text-sm text-gray-600">{notif.description}</div>
      </div>
    ),{
      position: "top-right",
    });
  });
  if (loading || !user) {
    return null; // don’t render listener until auth is ready
  }

  return null;
}

function detectType(log) {
  if (log.logDescription.includes("New Case")) return "created";
  if (log.logDescription.includes("Assigned")) return "assigned";
  if (log.logDescription.includes("Close")) return "closed";
  return "updated";
}

function typeColor(type) {
  return {
    created: "bg-blue-100 text-blue-700",
    updated: "bg-yellow-100 text-yellow-700",
    assigned: "bg-purple-100 text-purple-700",
    closed: "bg-green-100 text-green-700",
  }[type];
}
