/// <reference types="astro/client" />

interface Window {
  openInquiryModal?: (source?: string, interestHint?: string) => void;
  closeInquiryModal?: () => void;
}
