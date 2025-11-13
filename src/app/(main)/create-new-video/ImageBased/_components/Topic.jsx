"use client"
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {Loader2Icon, Pen, SparklesIcon, TextCursorInput} from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useAuthContext } from '@/app/provider'

const Suggestions = [
  "History Story",
  "Kids Story",
  "Movie Stories",
  "AI Innovation",
  "Space Mysteries",
  "Horror Stories",
  "Bhagwatgita verse explanations",
  "Ramayan summaries",
  "Mythological Tales",
  "Tech Reviews",
  "True Crime Stories",
  "Fantasy Adventures",
  "Science Experiments",
  "Motivational Stories",
]
const Topic = ({ onHandleInputChange }) => {
  const [selectedTopic, setSelectedTopic] = useState();
  const [selectedScriptIndex, setSelectedScriptIndex] = useState();
  const [scripts, setScripts] = useState();
  const [loading, setLoading] = useState(false);
  const {user}=useAuthContext();
  const GenerateScript = async () => {
    if(user?.credits <= 0){
          toast('Please add more credits!')
        }
    setLoading(true)
    setSelectedScriptIndex(null)
    try {
      const result = await axios.post('/api/generate-script', {
        topic: selectedTopic
      });
      console.log("This is data",result.data)
      setScripts(result.data.scripts)
      console.log("Scripts:", result.data?.resp.scripts)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)

  }
  return (
    <div className='mb-8 p-4 border border-gray-800 rounded-xl'>
      <h2 className='mb-1 flex items-center gap-2'><span className='text-pink-600'><TextCursorInput /></span>Project Title</h2>
      <Input placeholder='Enter Project Title' onChange={(event) => onHandleInputChange("title", event?.target.value)} />

      <div className='mt-8'>
        <h2 className='flex items-center gap-2'><Pen className='text-violet-600'/> Video Topic</h2>
        <p className='text-sm text-gray-600'>Select topic for your video</p>

        <Tabs defaultValue="suggestion" className="w-full mt-2">
          <TabsList>
            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestion">
            <div>
              {Suggestions.map((suggestion, index) => (
                <Button variant="outline" key={index}
                  className={`m-1 ${suggestion == selectedTopic && "bg-secondary"}`}
                  onClick={() => {
                    setSelectedTopic(suggestion)
                    onHandleInputChange("topic", suggestion)
                  }}>{suggestion}</Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="your_topic">
            <div>
              <h2>Enter your own topic</h2>
              <Textarea placeholder='e.g. The History of Apple Inc.'
                onChange={(event) => onHandleInputChange("topic", event?.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
          {scripts && scripts.length > 0 && (
            <div className='mt-5'>
              <h2>Select the Script</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
              {scripts.map((script, index) => (
                <div key={index} className={`p-3 border rounded-lg mt-3 cursor-pointer
                ${selectedScriptIndex==index&&"border-white bg-secondary "}
                `}
                onClick={() => {
                  setSelectedScriptIndex(index);
                  onHandleInputChange("script", script.content);
                }}>
                  <h2 className='line-clamp-4 text-sm text-gray-300'>{script.content}</h2>
                </div>
              ))}
              </div>
            </div>
          )}
      </div>
      <Button className='mt-5' size="sm" disabled={loading} onClick={GenerateScript}>
        {loading ? <Loader2Icon className='animate-spin' /> : <SparklesIcon />} Generate Script</Button>

    </div>
  )
}

export default Topic
