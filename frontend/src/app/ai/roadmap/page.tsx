"use client";

import { FormEvent, useState } from "react";
import { Map, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { aiService } from "@/services/api.service";

export default function RoadmapPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const focusAreas = String(formData.get("focusAreas") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await aiService.generateRoadmap({
        goal: String(formData.get("goal") || ""),
        currentLevel: formData.get("currentLevel") as "beginner" | "intermediate" | "advanced",
        weeklyHours: Number(formData.get("weeklyHours") || 8),
        focusAreas,
      });
      setOutput(JSON.stringify(response.roadmap, null, 2));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Could not generate roadmap"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-cyan-500" />
            AI roadmap generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Goal</label>
              <Input name="goal" placeholder="Become a full-stack AI SaaS developer" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Current level</label>
              <select name="currentLevel" className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Weekly hours</label>
              <Input name="weeklyHours" type="number" min="1" max="80" defaultValue="8" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Focus areas</label>
              <Input name="focusAreas" placeholder="frontend, backend, DSA, AI/ML, DevOps" />
            </div>
            <Button type="submit" isLoading={loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate roadmap
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generated plan</CardTitle>
        </CardHeader>
        <CardContent>
          {output ? (
            <pre className="max-h-[620px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-900">
              {output}
            </pre>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your personalized weekly plan will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
