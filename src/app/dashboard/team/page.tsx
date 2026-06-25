"use client";

import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { UserPlus, Trash2 } from "lucide-react";

export default function TeamPage() {
  const members = [
    { name: "Martin Safi", email: "martin.safi@adidas.com", role: "admin", status: "active" },
    { name: "Sara Jenkins", email: "sara.jenkins@adidas.com", role: "finance_manager", status: "active" },
    { name: "Alex Rivera", email: "alex.rivera@adidas.com", role: "viewer", status: "invited" },
  ];

  return (
    <div className="space-y-6 select-text">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Team Management</h2>
          <p className="text-xs font-semibold text-neutral-400 mt-1">
            Invite and manage permissions for members of this workspace.
          </p>
        </div>
        <Button className="h-9 px-4 text-xs font-bold gap-1.5">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Workspace Members
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-neutral-300">
            <thead>
              <tr className="border-b border-[#3a3a3a] pb-3 text-neutral-500">
                <th className="py-3">Name</th>
                <th className="py-3">Email Address</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3a3a3a]">
              {members.map((member) => (
                <tr key={member.email} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 text-white">{member.name}</td>
                  <td className="py-3.5 text-neutral-400 font-mono">{member.email}</td>
                  <td className="py-3.5 text-neutral-300 capitalize">{member.role.replace("_", " ")}</td>
                  <td className="py-3.5">
                    <Badge variant={member.status === "active" ? "success" : "neutral"} className="capitalize">
                      {member.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer focus:outline-none">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
