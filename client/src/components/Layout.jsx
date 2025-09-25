import Topbar from "@components/navi/Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <Topbar />
            <main className="pt-16"> {/* Topbar 높이 보정 */}
                <Outlet />
            </main>
        </div>
    );
}