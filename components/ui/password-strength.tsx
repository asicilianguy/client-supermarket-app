"use client"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks = [
    { label: "Almeno 8 caratteri", test: (p: string) => p.length >= 8 },
    { label: "Una lettera maiuscola", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Un numero", test: (p: string) => /\d/.test(p) },
    { label: "Un carattere speciale", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ]

  const passedChecks = checks.filter((check) => check.test(password)).length
  const strength = passedChecks === 0 ? 0 : (passedChecks / checks.length) * 100

  const getStrengthColor = () => {
    if (strength < 25) return "bg-red-500"
    if (strength < 50) return "bg-orange-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (strength < 25) return "Debole"
    if (strength < 50) return "Sufficiente"
    if (strength < 75) return "Buona"
    return "Forte"
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-nunito text-gray-600">Sicurezza password</span>
          <span className={`text-sm font-nunito font-semibold ${getStrengthColor().replace("bg-", "text-")}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                check.test(password) ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {check.test(password) && <span className="text-white text-xs">✓</span>}
            </div>
            <span
              className={`text-xs font-nunito transition-colors duration-200 ${
                check.test(password) ? "text-green-600" : "text-gray-500"
              }`}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
