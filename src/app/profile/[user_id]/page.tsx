"use client";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { Profile, TypingTest } from "@/types";
import { ChevronLeft, Clock, Keyboard, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ProfileSkeleton } from "@/components/Skeleton";

const Profiles = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [typingTests, setTypingTests] = useState<TypingTest[]>([]);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // get the params
  const params = useParams();
  const userId = params?.user_id;

  // call the API to get results data
  const { data: typingTestsResponse, error: typingTestsError } = useQuery({
    queryKey: ["fetchResults", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      return response.json();
    },
  });

  // set the profile data
  useEffect(() => {
    if (session) {
      setProfile({
        username: session.user.name,
        avatar_url: session.user.image ?? "",
        email: session.user.email,
      });
    }
  }, [session]);

  // set the typing tests data
  useEffect(() => {
    if (typingTestsResponse) {
      setTypingTests(typingTestsResponse);
    }
  }, [typingTestsResponse]);

  const totalTests = typingTests.length;

  const averageWPM = totalTests
    ? Math.round(
        typingTests.reduce((acc, test) => acc + Number(test.wpm), 0) /
          totalTests
      )
    : 0;

  const averageAccuracy = totalTests
    ? Math.round(
        typingTests.reduce((acc, test) => acc + Number(test.accuracy), 0) /
          totalTests
      )
    : 0;

  const bestWPM = totalTests
    ? Math.max(...typingTests.map((test) => test.wpm))
    : 0;

  if (typingTestsError) {
    return <div>Error: {typingTestsError.message}</div>;
  }
  if (!typingTestsResponse) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8 border-none rounded-lg">
        <div className="text-2xl font-bold">
          <div className="flex justify-between pr-6 pl-2">
            <p className="flex items-center gap-2">
              <ChevronLeft
                className="cursor-pointer"
                onClick={() => router.push("/")}
              />{" "}
              Profile
            </p>
            <ModeToggle />
          </div>
          <Separator className="my-4 border-gray-300 dark:border-gray-800  shadow-sm" />
        </div>

        {/* Profile Header */}
        <div className="mb-8 flex items-center gap-6 bg-card p-6 rounded-lg shadow-lg dark:bg-gray-800">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.username?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {profile?.username ?? "Anonymous"}
            </h1>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        {/* if no data found */}
        {typingTests.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-gray-500 text-4xl text-bold">
              No records found!
              <Link href="/" className="text-blue-500 hover:underline ml-2">
                Start typing
              </Link>
            </p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average WPM
                  </CardTitle>
                  <Keyboard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageWPM}</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Best WPM
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bestWPM}</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Accuracy
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageAccuracy}%</div>
                </CardContent>
              </Card>
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tests
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTests}</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card className="mb-8 dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Typing Speed Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={typingTests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="createdAt"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                        formatter={(value, name) => [
                          value,
                          name === "Accuracy" ? "Accuracy (%)" : "WPM",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="wpm"
                        stroke="#4f46e5"
                        name="WPM"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#059669"
                        name="Accuracy"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tests */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Recent Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {typingTests
                    .slice(-5)
                    .reverse()
                    .map((test, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg dark:bg-gray-700"
                      >
                        <div>
                          <p className="font-medium">{test.wpm} WPM</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(test.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {Math.round(test.accuracy)}% Accuracy
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {test.duration}s duration
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Profiles;
