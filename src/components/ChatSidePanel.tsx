"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useChatStore } from "@/store/useChatStore";
import { useSessionStore } from "@/store/useSessionStore";
import { useMethodStore } from "@/store/useMethodStore";

export function ChatSidePanel() {
  const { messages } = useChatStore();
  const { userId } = useSessionStore();
  const { method } = useMethodStore();

  const userCount = messages.filter((m) => m.sender === "user").length;
  const agentCount = messages.filter((m) => m.sender === "agent").length;
  const voiceCount = messages.filter((m) => m.voiceUrl).length;

  return (
    <Card className="w-full p-3 sm:p-4 lg:sticky lg:top-20 bg-white/60 dark:bg-gray-900/40 backdrop-blur border-white/20">
      <Tabs defaultValue="riwayat" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="riwayat" className="flex-1">
            Riwayat
          </TabsTrigger>
          <TabsTrigger value="info" className="flex-1">
            Info
          </TabsTrigger>
        </TabsList>

        {/* Tab: Riwayat — daftar ringkas semua pesan pada sesi ini */}
        <TabsContent value="riwayat">
          <ScrollArea className="h-[45vh] pr-3">
            {messages.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground select-none py-6">
                Belum ada pesan.
              </p>
            ) : (
              <ul className="space-y-2">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg border bg-background/40 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={m.sender === "user" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {m.sender === "user" ? "Anda" : "Agent"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {m.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-foreground/80 break-words">
                      {m.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Tab: Info — detail sesi & statistik percakapan */}
        <TabsContent value="info">
          <div className="space-y-3 text-sm">
            <InfoRow label="Session ID">
              <span className="font-mono text-xs break-all text-foreground/80">
                {userId || "—"}
              </span>
            </InfoRow>
            <InfoRow label="Method">
              <Badge variant="secondary" className="text-[10px]">
                {method}
              </Badge>
            </InfoRow>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Stat label="Total Pesan" value={messages.length} />
              <Stat label="Voice Note" value={voiceCount} />
              <Stat label="Dari Anda" value={userCount} />
              <Stat label="Dari Agent" value={agentCount} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background/40 px-3 py-2">
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
