
export interface BadgeData {
  id: string;
  title: string;
  recipientName: string;
  issuerName: string;
  issueDate: string;
  criteria: string;
  imageUrl?: string; // Optional: Base64 data URL for the custom badge image
  isCracha?: boolean; // Optional: True if this badge should be rendered as an ID card style
  recipientPhotoUrl?: string; // Optional: Base64 data URL for the recipient's photo (for crachá mode)
}