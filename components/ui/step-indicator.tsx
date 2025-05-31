"use client"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
  onStepClick?: (step: number) => void
}

export function StepIndicator({ currentStep, totalSteps, stepLabels, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8 flex justify-center">
      <div className="w-full max-w-sm">
        {/* Progress Bar */}
        <div className="flex items-center mb-6">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="flex items-center flex-1">
              <button
                onClick={() => onStepClick?.(index + 1)}
                disabled={!onStepClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-fredoka font-bold transition-all duration-300 relative ${
                  index + 1 <= currentStep
                    ? "bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-lg scale-110"
                    : index + 1 === currentStep + 1
                      ? "bg-gray-300 text-gray-600 hover:bg-gray-400 cursor-pointer"
                      : "bg-gray-200 text-gray-500"
                } ${onStepClick ? "hover:scale-105" : ""}`}
              >
                {index + 1 <= currentStep ? <span className="text-white">✓</span> : <span>{index + 1}</span>}

                {/* Active step pulse */}
                {index + 1 === currentStep && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink animate-ping opacity-30"></div>
                )}
              </button>

              {index < totalSteps - 1 && (
                <div className="flex-1 h-2 mx-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index + 1 < currentStep ? "bg-gradient-to-r from-primary-orange to-primary-pink" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between">
          {stepLabels.map((label, index) => (
            <div key={index} className="flex-1 text-center">
              <span
                className={`text-sm font-nunito font-medium transition-colors duration-300 ${
                  index + 1 <= currentStep
                    ? "text-primary-purple"
                    : index + 1 === currentStep + 1
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
