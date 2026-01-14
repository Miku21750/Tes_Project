import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/hooks/useNotification";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";

export function NotificationCard({ }) {
    const { user } = useAuth();
    const { notifications, deleteNotification } = useNotifications();

    const typeColors = {
        created: "bg-blue-100 text-blue-700",
        updated: "bg-yellow-100 text-yellow-700",
        assigned: "bg-purple-100 text-purple-700",
        closed: "bg-green-100 text-green-700",
    };
    return (
        notifications.map((i) => (
            <Card className="shadow-md border rounded-xl hover:shadow-lg transition flex dark:border-slate-600 dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" key={i.token}>                            
                <CardHeader className="flex flex-col gap-1">
                    <div className="flex justify-between items-center gap-10">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[i.type] || "bg-gray-100 text-gray-700"}`}>
                            {i.type || "unknown"}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(i.date).toLocaleString()}</span>
                    </div>
                    <CardTitle className="text-sm font-semibold">{i.title || `Case ${i.caseId}`}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className={"dark:text-gray-400"}>{i.description} by {i.user}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button variant={"outline"} className={"dark:border-b-slate-500 dark:bg-gradient-to-b dark:from-slate-600 dark:via-slate-800 dark:to-slate-700"} onClick={() =>  deleteNotification(i.token)}>
                    <Trash/>
                    </Button>
                </CardFooter>
            </Card>
        ))

    );
}
