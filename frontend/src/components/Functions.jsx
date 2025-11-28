import React, { useState } from 'react'
import Explain from './Explain'
import Recommend from './Recommend'
import Summary from './Summary'
import Insights from './Insights'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'

export default function Functions() {
    const [tab, setTab] = useState("explain")
    return (
        <div className="container mx-auto px-4 ">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <div className="flex justify-center">
                    <TabsList className='flex gap-32 mb-6 flex-wrap'>
                        <TabsTrigger value="explain">Explain</TabsTrigger>
                        <TabsTrigger value="recommend">Recommend</TabsTrigger>
                        <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="explain">
                    <Explain />
                </TabsContent>
                <TabsContent value="recommend">
                    <Recommend />
                </TabsContent>
                <TabsContent value="insights">
                    <Insights />
                </TabsContent>
            </Tabs>
            <h1 className='text-5xl justify-center my-5 font-semibold flex'>Summary</h1>
            <Summary />
        </div>
    )
}