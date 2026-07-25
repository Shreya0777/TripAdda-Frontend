// FIX (UX): the old form was one uninterrupted scroll with no sense of
// "how much is left." This gives a visible progress bar, lets the user
// jump back to any step they've already visited, and flags which steps
// still have missing required fields (rather than surfacing every error
// at once, at the very bottom, only after clicking Publish).
const StepProgress = ({ steps, currentStep, furthestStep, invalidSteps, onStepClick }) => {
  return (
    <div className="mb-6 overflow-x-auto sm:mb-8">
      <div className="flex min-w-max items-center gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isVisited = index <= furthestStep;
          const isInvalid = invalidSteps.includes(index) && index < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                disabled={!isVisited}
                onClick={() => isVisited && onStepClick(index)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isInvalid
                      ? "bg-red-50 text-red-600 border border-red-300"
                      : isVisited
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    isActive ? "bg-white text-blue-600" : "bg-white/60"
                  }`}
                >
                  {isInvalid ? "!" : index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>

              {index < steps.length - 1 && (
                <div className="h-px w-4 bg-gray-300 sm:w-8" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
