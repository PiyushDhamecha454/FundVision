import Functions from "../components/Functions"
import InteractiveBackground from "../components/ui/InteractiveBackground"

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <InteractiveBackground
        gradientColors={["#FFA500", "#FFD700"]}
        gradientColorsDark={["#0f0bef", "#ed021a"]}
        angle={40}
        noise={0.3}
        blindCount={64}
        blindMinWidth={5}
        spotlightRadius={0.8}
        spotlightSoftness={1}
        spotlightOpacity={1}
        mouseDampening={0.15}
        distortAmount={6}
        shineDirection="left"
      />
      <div className="relative z-10">
        <h1 className="flex justify-center text-9xl pt-40 pb-30 font-bold dark:text-white text-black">
          FundVision
        </h1>
        <Functions />
      </div>
    </div>
  )
}

export default Home