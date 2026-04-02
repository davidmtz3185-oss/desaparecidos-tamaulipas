'use client'

import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useRef } from 'react'

interface CaptchaWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export default function CaptchaWidget({ onVerify, onExpire }: CaptchaWidgetProps) {
  const captchaRef = useRef<HCaptcha>(null)

  return (
    <HCaptcha
      ref={captchaRef}
      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
      onVerify={onVerify}
      onExpire={onExpire}
      languageOverride="es"
      theme="light"
    />
  )
}
