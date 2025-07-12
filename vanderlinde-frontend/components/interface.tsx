"use client";

import Sidebar from "./ui/sidebar";
import Feed from "./feed/feed";

export default function Interface() {
    return (
        <div className="flex">
            <Sidebar />
            <Feed />
        </div>
    );
}