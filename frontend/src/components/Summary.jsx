import React from 'react'
import { Card } from './ui/card'
import shapPlot from '../assets/image.png'

const Summary = () => {
    return (
        <div className="space-y-6">

            {/* IMAGE */}
            <Card className="p-6 flex flex-col items-center bg-background">
                <img src={shapPlot} />
            </Card>

            {/* LLM SUMMARY */}
            <Card className="p-6 space-y-3 bg-background backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-center">Model Feature Impact Summary</h3>

                <p>
                    The plot shows how mutual fund features influence the model's prediction. Higher bars reflect
                    stronger impact on fund score/performance.
                </p>

                <table className="w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="font-medium">
                        <tr>
                            <th className="p-2 text-left">Feature</th>
                            <th className="p-2 text-left">Behavior</th>
                            <th className="p-2 text-left">Impact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr><td className="p-2 font-medium">3-Year Returns</td><td className="p-2">High variation</td><td className="p-2 text-green-600">Strong positive</td></tr>
                        <tr><td className="p-2 font-medium">Fund Age</td><td className="p-2">Older funds outperform</td><td className="p-2 text-green-600">Positive</td></tr>
                        <tr><td className="p-2 font-medium">Rating</td><td className="p-2">1–5 stars</td><td className="p-2 text-green-600">Higher = Better</td></tr>
                        <tr><td className="p-2 font-medium">Expense Ratio</td><td className="p-2">0.1%–2%+</td><td className="p-2 text-red-600">Lower = Better</td></tr>
                        <tr><td className="p-2 font-medium">1-Year Returns</td><td className="p-2">More unstable</td><td className="p-2 text-green-600">Positive <p className='text-red-600'>(weaker)</p></td></tr>
                        <tr><td className="p-2 font-medium">Fund Size (AUM)</td><td className="p-2">Small → Large</td><td className="p-2 text-green-600">Slight edge large</td></tr>
                        <tr><td className="p-2 font-medium">Risk Level</td><td className="p-2">Low → High</td><td className="p-2 text-green-600">Higher = Better</td></tr>
                        <tr><td className="p-2 font-medium">Min SIP/Lumpsum</td><td className="p-2">₹100–₹10k+</td><td className="p-2 text-red-600">Lower = Better</td></tr>
                    </tbody>
                </table>

                <p className="text-sm text-gray-600 italic text-center">
                    Worst-scoring categories include FoFs, Gilt, Credit Risk, and Low-Duration funds.
                </p>

                <p className="font-semibold text-center text-green-500">
                    🔎 Top-performing funds: high 3-year returns, low expenses, high ratings, older age, higher risk.
                </p>
            </Card>
        </div>
    )
}

export default Summary
