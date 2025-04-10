"use client";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { dummyTypingTests, Profile, TypingTest } from "@/types";
import { Clock, Keyboard, Target, Trophy } from "lucide-react";
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

const Profiles = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [errors, setError] = useState<string | null>(null);
  const [typingTests, setTypingTests] = useState<TypingTest[]>([]);
  const { data: session, isPending, error } = authClient.useSession();
  // if (error) {
  //   setError(error.message);
  // }
  // if (isPending) {
  //   return <div>Loading...</div>;
  // }
  // if (!session) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
  //       <div className="max-w-5xl mx-auto space-y-8 rounded-lg shadow-md">
  //         <div className="text-2xl font-bold">
  //           Profile
  //           <Separator className="my-4 border-gray-300 dark:border-gray-600  shadow-sm" />
  //         </div>
  //         <div className="mb-8 flex items-center gap-6 bg-card p-6 rounded-lg shadow-lg">
  //           <Avatar className="h-24 w-24">
  //             <AvatarFallback>?</AvatarFallback>
  //           </Avatar>
  //           <div>
  //             <h1 className="text-3xl font-bold mb-2">Anonymous</h1>
  //             <p className="text-muted-foreground">Typing enthusiast</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  // if (session) {
  //   setProfile({
  //     username: session.user.name,
  //     avatar_url: session.user.image ?? "",
  //     email: session.user.email,
  //   });
  // }

  useEffect(() => {
    console.log("Session data");
    if (session) {
      setProfile({
        username: session.user.name,
        avatar_url: session.user.image ?? "",
        email: session.user.email,
      });
    }
  }, [session]);

  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setTypingTests(dummyTypingTests);
      // setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const averageWPM = typingTests.length
    ? Math.round(
        typingTests.reduce((acc, test) => acc + test.wpm, 0) /
          typingTests.length
      )
    : 0;

  const averageAccuracy = typingTests.length
    ? Math.round(
        typingTests.reduce((acc, test) => acc + Number(test.accuracy), 0) /
          typingTests.length
      )
    : 0;

  const totalTests = typingTests.length;
  const bestWPM = typingTests.length
    ? Math.max(...typingTests.map((test) => test.wpm))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8 border-none rounded-lg">
        <div className="text-2xl font-bold">
          <div className="flex justify-between px-6">
            <p>Profile</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average WPM</CardTitle>
              <Keyboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageWPM}</div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best WPM</CardTitle>
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
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
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
                    dataKey="created_at"
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
                      name === "wpm" ? "WPM" : "Accuracy (%)",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="hsl(var(--chart-1))"
                    name="WPM"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--chart-2))"
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
                        {new Date(test.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {Math.round(test.accuracy)}% Accuracy
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {test.test_duration}s duration
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profiles;
