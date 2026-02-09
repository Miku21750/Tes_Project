import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router";
import { Buffer } from "buffer";
import { DraftProvider } from "./components/DraftContext";
import { Loader2 } from "lucide-react";
import { ViewCase } from "./pages/ViewCase";
import { UploadRma } from "./pages/uploadRMA";
import { AuthProvider } from "./context/auth-context";
import { TeamProvider } from "./context/team-context";
import { router } from "./router";
import { ReactQueryProvider } from "./provider/react-query-provider";




window.Buffer = Buffer;
createRoot(document.getElementById("root")).render(
  <StrictMode>
  <ReactQueryProvider>
    <AuthProvider>
    <TeamProvider>
      <DraftProvider>
    <RouterProvider router={router}/>
      </DraftProvider>
    </TeamProvider>
    </AuthProvider>
  </ReactQueryProvider>
  </StrictMode>
);
