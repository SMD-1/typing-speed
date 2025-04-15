"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  ArrowUpDown,
  Filter,
  Trophy,
  Medal,
  Type,
  Timer,
  Crown,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

async function fetchLeaderboard() {
  try {
    const response = await fetch("/api/results");
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return response.json();
  } catch (error) {
    console.log("Failed to fetch leaderboard", error);
    toast.error("Failed to fetch leaderboard");
  }
}

export default function LeaderboardPage() {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["results"],
    queryFn: fetchLeaderboard,
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return rank;
    }
  };

  const leaderboardData =
    data?.rows?.map((row: any, index: number) => {
      row.rank = index + 1;
      return row;
    }) || [];

  const sortedAndFilteredData = [...leaderboardData]
    .filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortField) return a.rank - b.rank;
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-8">
        <div className="mx-auto max-w-6xl">
          <Card className="p-6">
            <div className="text-center text-red-500">
              Error loading leaderboard. Please try again later.
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 from-background to-secondary p-4 md:p-8 ">
      <div className="mx-auto max-w-6xl dark:bg-gray-800">
        <Card className="p-4 md:p-6 dark:bg-gray-800">
          <button
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 border border-gray-300 dark:border-gray-600 p-2 rounded-md cursor-pointer w-fit"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                Typing Speed Leaderboard
              </h1>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
              <TabsList className="flex flex-wrap gap-2 dark:bg-gray-900">
                <TabsTrigger className="cursor-pointer" value="all">
                  All Time
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="daily">
                  Daily
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="weekly">
                  Weekly
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="monthly">
                  Monthly
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-row gap-4">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-59"
                />
              </div>
            </div>

            <TabsContent value="all">
              <Table>
                <TableCaption>Rankings of the fastest typists.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Player
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("wpm")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        WPM
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("accuracy")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Accuracy
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody key={leaderboardData.length}>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading leaderboard...
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedAndFilteredData.map((entry) => (
                      <TableRow
                        key={entry.user_id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-center">
                            {getRankIcon(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center font-semibold">
                          <Avatar className="h-7 w-7 mr-2">
                            <AvatarImage src={entry.image} />
                            <AvatarFallback>
                              {entry.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {entry.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Type className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{entry.wpm}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{entry.accuracy}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="daily">
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Daily rankings coming soon...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Weekly rankings coming soon...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="monthly">
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Monthly rankings coming soon...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
