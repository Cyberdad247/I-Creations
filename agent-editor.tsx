"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import ToolsConfiguration from "@/components/tools-configuration"
import MemoryConfiguration from "@/components/memory-configuration"
import DeploymentOptions from "@/components/deployment-options"
import { Toast } from "./Toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  model: z.string({
    required_error: "Please select a model.",
  }),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  maxTokens: z.coerce.number().min(100).max(32000),
  temperature: z.coerce.number().min(0).max(2),
  streaming: z.boolean().default(true),
})

export default function AgentEditor({ agentId }: { agentId: string }) {
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      model: "",
      systemPrompt: "",
      maxTokens: 1024,
      temperature: 0.7,
      streaming: true,
    },
  })

  // Simulate fetching agent data
  useEffect(() => {
    // In a real app, you would fetch the agent data from an API
    const agentData = {
      name: "Customer Support Agent",
      description: "Handles customer inquiries and support tickets",
      model: "gpt-4o",
      systemPrompt:
        "You are a helpful customer support agent for our company. You have access to our product documentation and can search the web for additional information. Always be polite and professional.",
      maxTokens: 1024,
      temperature: 0.7,
      streaming: true,
    }

    form.reset(agentData)
  }, [form, agentId])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setToast({ message: "Saving agent...", type: "info" })
    // Simulate async save
    setTimeout(() => {
      setLoading(false)
      // Simulate random error
      if (values.name.toLowerCase().includes("error")) {
        setToast({ message: "Failed to save agent.", type: "error" })
      } else {
        setToast({ message: "Agent saved successfully!", type: "success" })
        setTimeout(() => router.push("/"), 1000)
      }
    }, 1200)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="model">Model Settings</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer Support Agent" {...field} />
                    </FormControl>
                    <FormDescription>A descriptive name for your agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="This agent helps customers with product inquiries and support issues."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Describe what your agent does and its purpose.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="model" className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the AI model that powers your agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="You are a helpful AI assistant." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormDescription>Instructions that define your agent's behavior and capabilities.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="maxTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens</FormLabel>
                      <FormControl>
                        <Input type="number" min={100} max={32000} {...field} />
                      </FormControl>
                      <FormDescription>Maximum length of the model's response.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={2} step={0.1} {...field} />
                      </FormControl>
                      <FormDescription>Controls randomness (0 = deterministic, 2 = very random).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="streaming"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Streaming Responses</FormLabel>
                      <FormDescription>Enable token-by-token streaming for faster responses.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <MemoryConfiguration />
            </TabsContent>

            <TabsContent value="tools" className="pt-4">
              <ToolsConfiguration />
            </TabsContent>

            <TabsContent value="deployment" className="pt-4">
              <DeploymentOptions />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  Saving...
                </span>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
      <Toast
        message={toast?.message || ""}
        type={toast?.type}
        onClose={() => setToast(null)}
        duration={toast?.type === 'error' ? 3500 : 2000}
      />
    </>
  )
}
