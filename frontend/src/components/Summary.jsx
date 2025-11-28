import React from 'react'
import { Card } from './ui/card'
import shapPlot from '../assets/image.png'

export default function Summary () {
    return (
        <div className="space-y-6">

            {/* IMAGE */}
            <Card className="p-6 flex flex-col items-center bg-background/30 backdrop-blur-sm">
                <img src={shapPlot} />
            </Card>

            {/* LLM SUMMARY */}
            <Card className="p-6 space-y-3 bg-background/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-center">Model Feature Impact Summary</h3>

                <p className='flex justify-center text-xl'>
                    The plot shows how mutual fund features influence the model's prediction. Higher bars reflect
                    stronger impact on fund score/performance.
                </p>

                <table className="w-full text-lg border rounded-lg overflow-hidden backdrop-blur-sm">
                    <thead className="font-medium">
                        <tr>
                            <th className="p-2 text-center bg-background/30">Feature</th>
                            <th className="p-2 text-center bg-background/30">Behavior</th>
                            <th className="p-2 text-center bg-background/30">Impact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr><td className="p-2 font-medium text-center">3-Year Returns</td><td className="p-2 text-center">High variation</td><td className="p-2 text-green-600 text-center">Strong positive</td></tr>
                        <tr><td className="p-2 font-medium text-center">Fund Age</td><td className="p-2 text-center">Older funds outperform</td><td className="p-2 text-green-600 text-center">Positive</td></tr>
                        <tr><td className="p-2 font-medium text-center">Rating</td><td className="p-2 text-center">1–5 stars</td><td className="p-2 text-green-600 text-center">Higher = Better</td></tr>
                        <tr><td className="p-2 font-medium text-center">Expense Ratio</td><td className="p-2 text-center">0.1%–2%+</td><td className="p-2 text-red-600 text-center">Lower = Better</td></tr>
                        <tr><td className="p-2 font-medium text-center">1-Year Returns</td><td className="p-2 text-center">More unstable</td><td className="p-2 text-green-600 text-center">Positive <p className='text-red-600'>(weaker)</p></td></tr>
                        <tr><td className="p-2 font-medium text-center">Fund Size (AUM)</td><td className="p-2 text-center">Small → Large</td><td className="p-2 text-green-600 text-center">Slight edge large</td></tr>
                        <tr><td className="p-2 font-medium text-center">Risk Level</td><td className="p-2 text-center">Low → High</td><td className="p-2 text-green-600 text-center">Higher = Better</td></tr>
                        <tr><td className="p-2 font-medium text-center">Min SIP/Lumpsum</td><td className="p-2 text-center">₹100–₹10k+</td><td className="p-2 text-red-600 text-center">Lower = Better</td></tr>
                    </tbody>
                </table>

                <p className="text-md dark:text-gray-300 italic text-center">
                    Worst-scoring categories include FoFs, Gilt, Credit Risk, and Low-Duration funds.
                </p>

                <p className="font-semibold text-center text-green-500">
                    🔎 Top-performing funds: high 3-year returns, low expenses, high ratings, older age, higher risk.
                </p>
            </Card>
        </div>
    )
}